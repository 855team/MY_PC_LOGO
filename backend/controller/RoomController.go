package controller

import (
	"backend/dao"
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

		rid := sse.NextRoom
		sse.Rooms[sse.NextRoom] = &utils.RoomEntry{
			Name: name,
			Owner: uid,
			Partner: 0,
			OwnerName: dao.GetUserByUid(uid).Username,
			PartnerName: "",
			HasOwner: true,
			HasPartner: false,
			OwnerStream: make(chan []utils.CommandEntry, 10),
			PartnerStream: make(chan []utils.CommandEntry, 10),
			File: make([]utils.CommandEntry, 1),
			Lock: new(sync.Mutex),
		}
		sse.NextRoom++

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
			Uid1: entry.Owner,
			Uid2: entry.Partner,
			Username1: entry.OwnerName,
			Username2: entry.PartnerName,
			IsInRoom1: entry.HasOwner,
			IsInRoom2: entry.HasPartner,
		})
		for {
			s := <-entry.OwnerStream
			if s == nil {
				if entry.HasPartner {
					utils.SendStreamResponse(ctx, flusher, true, utils.RoomUserEnterNotify, utils.NotifyEntry{
						Uid: entry.Partner,
						Username: entry.PartnerName,
					})
				} else {
					utils.SendStreamResponse(ctx, flusher, true, utils.RoomUserLeaveNotify, utils.NotifyEntry{
						Uid: entry.Partner,
						Username: entry.PartnerName,
					})
				}
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
		} else if !entry.HasPartner && (entry.Partner == uid || entry.Partner == 0) && entry.Owner != uid {
			entry.Lock.Lock()
			if entry.Partner == 0 {
				entry.PartnerName = dao.GetUserByUid(uid).Username
			} else {
				entry.PartnerStream = make(chan []utils.CommandEntry, 10)
				entry.PartnerStream <- entry.File
			}
			entry.Partner = uid
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
				Uid1: entry.Owner,
				Uid2: entry.Partner,
				Username1: entry.OwnerName,
				Username2: entry.PartnerName,
				IsInRoom1: entry.HasOwner,
				IsInRoom2: entry.HasPartner,
			})
			for {
				s := <-entry.PartnerStream
				if s == nil {
					if entry.HasOwner {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomUserEnterNotify, utils.NotifyEntry{
							Uid: entry.Owner,
							Username: entry.OwnerName,
						})
					} else {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomUserLeaveNotify, utils.NotifyEntry{
							Uid: entry.Owner,
							Username: entry.OwnerName,
						})
					}
				} else {
					if s[0].Uid != 0 {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomCommandStream, s)
						flusher.Flush()
					}
				}
			}
		} else if !entry.HasOwner && (entry.Owner == uid || entry.Owner == 0) && entry.Partner != uid {
			entry.Lock.Lock()
			entry.Owner = uid
			entry.HasOwner = true
			if entry.Owner == uid {
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
				Uid1: entry.Owner,
				Uid2: entry.Partner,
				Username1: entry.OwnerName,
				Username2: entry.PartnerName,
				IsInRoom1: entry.HasOwner,
				IsInRoom2: entry.HasPartner,
			})
			for {
				s := <-entry.OwnerStream
				if s == nil {
					if entry.HasPartner {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomUserEnterNotify, utils.NotifyEntry{
							Uid: entry.Partner,
							Username: entry.PartnerName,
						})
					} else {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomUserLeaveNotify, utils.NotifyEntry{
							Uid: entry.Partner,
							Username: entry.PartnerName,
						})
					}
				} else {
					if s[0].Uid != 0 {
						utils.SendStreamResponse(ctx, flusher, true, utils.RoomCommandStream, s)
						flusher.Flush()
					}
				}
			}
		} else if (entry.HasOwner && entry.Owner == uid) || (entry.HasPartner && entry.Partner == uid) {
			utils.SendStreamResponse(ctx, flusher, false, utils.RoomUserAlreadyInRoom, nil)
			return
		} else {
			utils.SendStreamResponse(ctx, flusher, false, utils.RoomNoPermission, nil)
			return
		}
	}
}
