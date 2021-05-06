package tests

import (
	"backend/controller"
	"backend/dao"
	"backend/model"
	"backend/service"
	"backend/utils"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/httptest"
	"github.com/prashantv/gostub"
	"sync"
	"testing"
)

// DD-NewCommand-全路径覆盖
func TestNewCommand(t *testing.T) {
	// B0->C0->B1->return
	stub := gostub.StubFunc(&service.CheckToken, uint(0))
	service.NewCommand(utils.NewCommandParams{})
	stub.Reset()

	// B0->C0->B2->C1->B3->return
	stub = gostub.StubFunc(&service.CheckToken, uint(1))
	service.NewCommand(utils.NewCommandParams{})
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B5->return
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false},
	}})
	service.NewCommand(utils.NewCommandParams{Rid: 1})
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->C3->B6->return
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 2}, Partner: model.User{Uid: 3}},
		}})
	service.NewCommand(utils.NewCommandParams{Rid: 1})
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->C3->B7->C4->B8->B10->return
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				File: []utils.CommandEntry{{Uid: 0}}, Lock: &sync.Mutex{},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10)},
		}})
	service.NewCommand(utils.NewCommandParams{Rid: 1})
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->C3->B7->C4->B9->B10->return
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				File: []utils.CommandEntry{{Uid: 1}}, Lock: &sync.Mutex{},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10)},
		}})
	service.NewCommand(utils.NewCommandParams{Rid: 1})
	stub.Reset()
}

// DD-HandleRoom-全路径覆盖
func TestHandleRoom(t *testing.T) {
	app := new(iris.Application)
	pool := GetContextPool(app)
	// B0->C0->b1->return
	// untestable

	// B0->C0->B2->C1->B3->return
	ctx := pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms", nil))
	stub := gostub.StubFunc(&service.CheckToken, uint(0))
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B5->C3->B7->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?type=new&name=r", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		StubFunc(&utils.SendStreamResponse).
		StubFunc(&dao.GetUserByUid, model.User{})
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B5->C3->B6->B7->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?type=new", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		StubFunc(&utils.SendStreamResponse).
		StubFunc(&dao.GetUserByUid, model.User{})
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->B9->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=0", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{}})
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->B10->C6->B11->B13->C7->B15->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false, HasPartner: false, Owner: model.User{Uid: 2}, Partner: model.User{Uid: 0},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->B10->C6->B11->B13->C7->B14->B15->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: false, Owner: model.User{Uid: 2}, Partner: model.User{Uid: 0},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->B10->C6->B12->B13->C7->B15->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false, HasPartner: false, Owner: model.User{Uid: 2}, Partner: model.User{Uid: 1},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->B10->C6->B12->B13->C7->B14->B15->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: false, Owner: model.User{Uid: 2}, Partner: model.User{Uid: 1},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->B16->C9->C10->B19->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false, HasPartner: false, Owner: model.User{Uid: 0}, Partner: model.User{Uid: 2},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->B16->C9->C10->B18->B19->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false, HasPartner: true, Owner: model.User{Uid: 0}, Partner: model.User{Uid: 2},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->B16->C9->B17->C10->B19->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false, HasPartner: false, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{Uid: 1}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->B16->C9->B17->C10->B18->B19->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: false, HasPartner: true, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&dao.GetUserByUid, model.User{Uid: 1}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->C11->B20->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: false, Owner: model.User{Uid: 1}, Partner: model.User{Uid: 2},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()

	// B0->C0->B2->C1->B4->C2->B8->C4->C5->C8->C11->B21->return
	ctx = pool.Acquire(httptest.NewRecorder(), httptest.NewRequest("GET", "/rooms?rid=1", nil))
	stub = gostub.StubFunc(&service.CheckToken, uint(1)).
		Stub(&service.RoomSSE, &service.SSE{Rooms: map[uint]*utils.RoomEntry{
			1: {HasOwner: true, HasPartner: true, Owner: model.User{Uid: 3}, Partner: model.User{Uid: 2},
				OwnerStream: make(chan []utils.CommandEntry, 10), PartnerStream: make(chan []utils.CommandEntry, 10),
				Lock: &sync.Mutex{}},
		}}).
		StubFunc(&utils.SendStreamResponse)
	controller.HandleRoom(ctx)
	stub.Reset()
}
