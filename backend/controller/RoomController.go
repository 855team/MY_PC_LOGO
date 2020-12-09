package controller

import (
	"backend/dao"
	"backend/model"
	"backend/service"
	"backend/utils"
	"github.com/kataras/golog"
	"github.com/kataras/iris/v12"
	"strconv"
	"sync"
	"time"
)

func GetRooms(ctx iris.Context) {
	success, msg, data := service.GetRooms()

	utils.SendResponse(ctx, success, msg, data)
}

func NewCommand(ctx iris.Context) {
	var params utils.NewCommandParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg := service.NewCommand(params)

	utils.SendResponse(ctx, success, msg, nil)
}

func HandleRoom(ctx iris.Context) {
	sse := service.RoomSSE

	ctx.ContentType("text/event-stream")
	ctx.Header("Cache-Control", "no-cache")
	ctx.Header("Connection", "keep-alive")
	ctx.Header("Access-Control-Allow-Origin", "")
	ctx.Header("Access-Control-Allow-Origin", "*")

	flusher, ok := ctx.ResponseWriter().Flusher()
	if !ok {
		utils.SendStreamResponse(ctx, flusher, false, utils.RoomSSENotSupported, nil)
		ctx.StopWithText(iris.StatusHTTPVersionNotSupported, "SSE Not Supported!")
		return
	}

	uid := service.CheckToken(ctx.URLParam("token"))
	if uid == 0 {
		utils.SendStreamResponse(ctx, flusher, false, utils.InvalidToken, nil)
		return
	}

	isNew := ctx.URLParam("type") == "new"

	if isNew {
		name := ctx.URLParam("name")
		if name == "" {
			name = "Room-" + time.Now().Format("2006-01-02-15:04:05")
		}

		sse.Glock.Lock()
		rid := sse.NextRoom
		sse.Rooms[sse.NextRoom] = &utils.RoomEntry{
			Name: name,
			Owner: dao.GetUserByUid(uid),
			Partner: model.User{},
			HasOwner: true,
			HasPartner: false,
			OwnerStream: make(chan []utils.CommandEntry, 10),
			PartnerStream: make(chan []utils.CommandEntry, 10),
			File: make([]utils.CommandEntry, 1),
			Lock: new(sync.Mutex),
		}
		sse.NextRoom++
		sse.Glock.Unlock()

		entry := sse.Rooms[rid]

		ctx.OnClose(func(iris.Context) {
			entry.Lock.Lock()
			entry.HasOwner = false
			if entry.HasPartner {
				entry.PartnerStream <- nil
			}
			entry.Lock.Unlock()

			golog.Println(strconv.Itoa(int(rid)) + " - Owner Quit -" + strconv.Itoa(int(uid)))

			if !entry.HasOwner && !entry.HasPartner {
				sse.ClosingRooms <- rid
			}
		})

		golog.Println(strconv.Itoa(int(rid)) + " - New Owner -" + strconv.Itoa(int(uid)))

		utils.SendStreamResponse(ctx, flusher, true, utils.RoomEnterSuccess, utils.GetRoomsResponse{
			Rid: rid,
			Name: entry.Name,
			Uid1: entry.Owner.Uid,
			Uid2: entry.Partner.Uid,
			Username1: entry.Owner.Username,
			Username2: entry.Partner.Username,
			Turtle1: entry.Owner.Turtle,
			Turtle2: entry.Partner.Turtle,
			IsInRoom1: entry.HasOwner,
			IsInRoom2: entry.HasPartner,
		})
		for {
			s := <-entry.OwnerStream
			if s == nil {
				var msg int
				if entry.HasPartner {
					msg = utils.RoomUserEnterNotify
				} else {
					msg = utils.RoomUserLeaveNotify
				}
				utils.SendStreamResponse(ctx, flusher, true, msg, utils.NotifyEntry{
					Uid: entry.Partner.Uid,
					Username: entry.Partner.Username,
					Turtle: entry.Partner.Turtle,
				})
			} else {
				if s[0].Uid != 0 {
					utils.SendStreamResponse(ctx, flusher, true, utils.RoomCommandStream, s)
					flusher.Flush()
				}
			}
		}
	} else {
		_rid, _ := strconv.ParseUint(ctx.URLParam("rid"), 10, 64)
		rid := uint(_rid)
		if entry, ok := sse.Rooms[rid]; !ok {
			utils.SendStreamResponse(ctx, flusher, false, utils.RoomDoNotExist, nil)
			return
		} else if !entry.HasPartner && (entry.Partner.Uid == uid || entry.Partner.Uid == 0) && entry.Owner.Uid != uid {
			entry.Lock.Lock()
			if entry.Partner.Uid == 0 {
				entry.Partner = dao.GetUserByUid(uid)
			} else {
				entry.PartnerStream = make(chan []utils.CommandEntry, 10)
				entry.PartnerStream <- entry.File
			}
			entry.HasPartner = true
			if entry.HasOwner {
				entry.OwnerStream <- nil
			}
			entry.Lock.Unlock()

			ctx.OnClose(func(iris.Context) {
				entry.Lock.Lock()
				entry.HasPartner = false
				if entry.HasOwner {
					entry.OwnerStream <- nil
				}
				entry.Lock.Unlock()

				golog.Println(strconv.Itoa(int(rid)) + " - Partner Quit -" + strconv.Itoa(int(uid)))

				if !entry.HasOwner && !entry.HasPartner {
					sse.ClosingRooms <- rid
				}
			})

			golog.Println(strconv.Itoa(int(rid)) + " - New Partner -" + strconv.Itoa(int(uid)))

			utils.SendStreamResponse(ctx, flusher, true, utils.RoomEnterSuccess, utils.GetRoomsResponse{
				Rid: rid,
				Name: entry.Name,
				Uid1: entry.Owner.Uid,
				Uid2: entry.Partner.Uid,
				Username1: entry.Owner.Username,
				Username2: entry.Partner.Username,
				Turtle1: entry.Owner.Turtle,
				Turtle2: entry.Partner.Turtle,
				IsInRoom1: entry.HasOwner,
				IsInRoom2: entry.HasPartner,
			})
			for {
				s := <-entry.PartnerStream
				if s == nil {
					var msg int
					if entry.HasOwner {
						msg = utils.RoomUserEnterNotify
					} else {
						msg = utils.RoomUserLeaveNotify
					}
					utils.SendStreamResponse(ctx, flusher, true, msg, utils.NotifyEntry{
						Uid: entry.Owner.Uid,
						Username: entry.Owner.Username,
						Turtle: entry.Owner.Turtle,
					})
				} else {
					if s[0].Uid != 0 {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomCommandStream, s)
					}
				}
			}
		} else if !entry.HasOwner && (entry.Owner.Uid == uid || entry.Owner.Uid == 0) && entry.Partner.Uid != uid {
			entry.Lock.Lock()
			entry.Owner = dao.GetUserByUid(uid)
			entry.HasOwner = true
			if entry.Owner.Uid == uid {
				entry.OwnerStream = make(chan []utils.CommandEntry, 10)
				entry.OwnerStream <- entry.File
			}
			if entry.HasPartner {
				entry.PartnerStream <- nil
			}
			entry.Lock.Unlock()

			ctx.OnClose(func(iris.Context) {
				entry.Lock.Lock()
				entry.HasOwner = false
				if entry.HasPartner {
					entry.PartnerStream <- nil
				}
				entry.Lock.Unlock()

				golog.Println(strconv.Itoa(int(rid)) + " - Owner Quit -" + strconv.Itoa(int(uid)))

				if !entry.HasOwner && !entry.HasPartner {
					sse.ClosingRooms <- rid
				}
			})

			golog.Println(strconv.Itoa(int(rid)) + " - New Owner -" + strconv.Itoa(int(uid)))

			utils.SendStreamResponse(ctx, flusher, true, utils.RoomEnterSuccess, utils.GetRoomsResponse{
				Rid: rid,
				Name: entry.Name,
				Uid1: entry.Owner.Uid,
				Uid2: entry.Partner.Uid,
				Username1: entry.Owner.Username,
				Username2: entry.Partner.Username,
				Turtle1: entry.Owner.Turtle,
				Turtle2: entry.Partner.Turtle,
				IsInRoom1: entry.HasOwner,
				IsInRoom2: entry.HasPartner,
			})
			for {
				s := <-entry.OwnerStream
				if s == nil {
					var msg int
					if entry.HasPartner {
						msg = utils.RoomUserEnterNotify
					} else {
						msg = utils.RoomUserLeaveNotify
					}
					utils.SendStreamResponse(ctx, flusher, true, msg, utils.NotifyEntry{
						Uid: entry.Partner.Uid,
						Username: entry.Partner.Username,
						Turtle: entry.Partner.Turtle,
					})
				} else {
					if s[0].Uid != 0 {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomCommandStream, s)
					}
				}
			}
		} else if (entry.HasOwner && entry.Owner.Uid == uid) || (entry.HasPartner && entry.Partner.Uid == uid) {
			utils.SendStreamResponse(ctx, flusher, false, utils.RoomUserAlreadyInRoom, nil)
			return
		} else {
			utils.SendStreamResponse(ctx, flusher, false, utils.RoomNoPermission, nil)
			return
		}
	}
}
