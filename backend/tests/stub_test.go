package tests

import (
	"backend/dao"
	"backend/model"
	"backend/service"
	"backend/utils"
	"github.com/prashantv/gostub"
	"testing"
)

func TestStub(t *testing.T) {
	// 函数打桩，需要函数体
	stubFunc1 := gostub.Stub(&utils.UintListContains, func(list []uint, element uint) bool {
		return list[0] == element
	})
	defer stubFunc1.Reset() // 复原，一定要

	l := []uint{1, 2, 3}
	t.Log("stubFunc1", utils.UintListContains(l, 2))

	// 函数打桩，不需要函数体
	stubFunc2 := gostub.StubFunc(&utils.UintListContains, true)
	defer stubFunc2.Reset()

	t.Log("stubFunc2", utils.UintListContains(l, 0))

	// 变量打桩
	str := "old"
	stubVar := gostub.Stub(&str, "new")
	defer stubVar.Reset()

	t.Log("stubVar", str)
}

func TestGetProjectSimple(t *testing.T) {
	defer gostub.StubFunc(&utils.UintListContains, true).
		StubFunc(&service.CheckToken, uint(100)).
		StubFunc(&dao.GetPidsByUid, []uint{1, 2, 3}).
		StubFunc(&dao.GetProjectWithFilesByPid, model.Project{Pid: 0, Name: "test", Files: nil}).Reset()
	success, msg, data := service.GetProject(utils.GetProjectParams{Pid: 100})
	t.Log(success, msg, data)
}