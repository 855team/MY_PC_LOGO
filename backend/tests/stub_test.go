package tests

import (
	"backend/utils"
	"github.com/prashantv/gostub"
	"testing"
)

func TestStub(t *testing.T) {
	// 函数打桩
	stubFunc := gostub.Stub(&utils.UintListContains, func(list []uint, element uint) bool {
		return list[0] == element
	})
	defer stubFunc.Reset() // 复原，一定要

	l := []uint{1, 2, 3}
	t.Log("stubFunc", utils.UintListContains(l, 2))

	// 变量打桩
	str := "old"
	stubVar := gostub.Stub(&str, "new")
	defer stubVar.Reset() // 一定要

	t.Log("stubVar", str)
}