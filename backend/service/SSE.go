package service

import (
	"backend/utils"
	"github.com/kataras/golog"
)

var RoomSSE = NewSSE()

type SSE struct {
	ClosingRooms chan uint
	Rooms        map[uint]*utils.RoomEntry
	NextRoom     uint
}

func NewSSE() *SSE {
	sse := &SSE{
		ClosingRooms: make(chan uint, 1),
		Rooms:        make(map[uint]*utils.RoomEntry),
		NextRoom:     1,
	}

	go sse.listen()

	return sse
}

func (sse *SSE) GetRoomEntry(rid uint) *utils.RoomEntry {
	if entry, ok := sse.Rooms[rid]; ok {
		return entry
	} else {
		return nil
	}
}

func (sse *SSE) listen() {
	for {
		select {
		case s := <-sse.ClosingRooms:
			room := sse.Rooms[s]
			if room.Owner != 0 && room.Partner != 0 {
				fileStr := ""
				for _, cmd := range room.File {
					fileStr += cmd.Command
				}
				NewRoomProjectAndFile(room.Name+"-RoomProject", room.Name+"-RoomFile", room.Owner, room.Partner, fileStr)
			}
			delete(sse.Rooms, s)
			golog.Infof("Removed client. %d registered Rooms", len(sse.Rooms))
		}
	}
}