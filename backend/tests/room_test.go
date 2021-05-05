package tests

import (
	"backend/model"
	"backend/service"
	"backend/utils"
	"github.com/prashantv/gostub"
	"sync"
	"testing"
)

func TestNewCommandService(t *testing.T) {
	// B0->C0->B1->return
	defer gostub.StubFunc(&service.CheckToken, uint(0)).Reset()
	service.NewCommand(utils.NewCommandParams{})

	// B0->C0->B2->C1->B3->return
	defer gostub.StubFunc(&service.CheckToken, uint(1)).Reset()
	service.NewCommand(utils.NewCommandParams{})

	// B0->C0->B2->C1->B4->C2->B5->return
	defer gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false},
	}}).Reset()
	service.NewCommand(utils.NewCommandParams{Rid: 1})

	// B0->C0->B2->C1->B4->C2->C3->B6->return
	defer gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 2}, Partner: model.User{Uid: 3}},
		}}).Reset()
	service.NewCommand(utils.NewCommandParams{Rid: 1})

	// B0->C0->B2->C1->B4->C2->C3->B7->C4->B8->B10->return
	defer gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				File: []utils.CommandEntry{{Uid: 0}}, Lock: &sync.Mutex{},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10)},
		}}).Reset()
	service.NewCommand(utils.NewCommandParams{Rid: 1})

	// B0->C0->B2->C1->B4->C2->C3->B7->C4->B9->B10->return
	defer gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				File: []utils.CommandEntry{{Uid: 1}}, Lock: &sync.Mutex{},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10)},
		}}).Reset()
	service.NewCommand(utils.NewCommandParams{Rid: 1})
}
