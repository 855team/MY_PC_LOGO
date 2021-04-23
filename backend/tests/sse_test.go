package tests

import (
	"backend/controller"
	"backend/utils"
	"encoding/json"
	"github.com/kataras/iris/v12/context"
	"github.com/kataras/iris/v12/httptest"
	stl_httptest "net/http/httptest"
	"testing"
	"time"
)

var (
	ownerRecorder	*stl_httptest.ResponseRecorder
	partnerRecorder	*stl_httptest.ResponseRecorder
)

func TestSSEMain(t *testing.T) {
	ownerReq := httptest.NewRequest("GET", "/rooms?type=new&token="+testToken1, nil)
	ownerReq2 := httptest.NewRequest("GET", "/rooms?rid=1&token="+testToken1, nil)
	partnerReq := httptest.NewRequest("GET", "/rooms?rid=1&token="+testToken2, nil)
	ownerRecorder = httptest.NewRecorder()
	partnerRecorder = httptest.NewRecorder()
	ownerCtx := &context.Context{}
	partnerCtx := &context.Context{}

	/* User 1 Create Room 1 as Owner */
	go Do(&ownerCtx, ownerRecorder, ownerReq, controller.HandleRoom)
	time.Sleep(1 * time.Second)

	/* On-connected Msg From Owner SSE */
	ownerRes := utils.ResponseBean{}
	_ = json.Unmarshal(ownerRecorder.Body.Bytes()[5:], &ownerRes)
	ownerRecorder.Body.Reset()
	t.Log(ownerRes.Msg, ownerRes.Data)

	/* User 2 Create Room 2 as Partner */
	go Do(&partnerCtx, partnerRecorder, partnerReq, controller.HandleRoom)
	time.Sleep(1 * time.Second)

	/* On-connected Msg From Partner SSE */
	partnerRes := utils.ResponseBean{}
	_ = json.Unmarshal(partnerRecorder.Body.Bytes()[5:], &partnerRes)
	partnerRecorder.Body.Reset()
	t.Log(partnerRes.Msg, partnerRes.Data)

	/* Partner Leaves Room 1 */
	ownerRecorder.Body.Reset()
	partnerCtx.EndRequest()
	time.Sleep(1 * time.Second)

	/* Buddy Leaving Msg from Owner */
	_ = json.Unmarshal(ownerRecorder.Body.Bytes()[5:], &ownerRes)
	ownerRecorder.Body.Reset()
	t.Log(ownerRes.Msg, ownerRes.Data)

	/* Partner Reenters Room 1 */
	go Do(&partnerCtx, partnerRecorder, partnerReq, controller.HandleRoom)
	time.Sleep(1 * time.Second)

	/* Owner Leaves Room 1 */
	partnerRecorder.Body.Reset()
	ownerCtx.EndRequest()
	time.Sleep(1 * time.Second)

	/* Buddy Leaving Msg from Partner */
	_ = json.Unmarshal(partnerRecorder.Body.Bytes()[5:], &partnerRes)
	partnerRecorder.Body.Reset()
	t.Log(partnerRes.Msg, partnerRes.Data)

	/* Owner Reenters Room 1 */
	go Do(&ownerCtx, ownerRecorder, ownerReq2, controller.HandleRoom)
	time.Sleep(1 * time.Second)
}
