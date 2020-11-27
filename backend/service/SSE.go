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
			if room.OwnerRecord != 0 && room.PartnerRecord != 0 {
				NewRoomProjectAndFile(room.Name+"-Project", room.Name+"-File", room.OwnerRecord, room.PartnerRecord, room.File)
			}
			delete(sse.Rooms, s)
			golog.Infof("Removed client. %d registered Rooms", len(sse.Rooms))
		}
	}
}