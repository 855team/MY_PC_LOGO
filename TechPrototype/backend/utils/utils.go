package utils

import (
	"github.com/kataras/iris/v12"
)

func GetContextParams(ctx iris.Context, params interface{}) bool {
	if err := ctx.ReadJSON(params); err != nil {
		ctx.StatusCode(iris.StatusBadRequest)
		_, _ = ctx.JSON(ResponseBean{
			Success: false,
			Msg: InvalidFormat,
			Data: nil,
		})
		return false
	}
	return true
}

func SendResponse(ctx iris.Context, success bool, msg int, data interface{}) {
	ctx.StatusCode(iris.StatusOK)
	_, _ = ctx.JSON(ResponseBean{
		Success: success,
		Msg: msg,
		Data: data,
	})
}

func UintListContains(list []uint, element uint) bool {
	for _, elem := range list {
		if elem == element {
			return true
		}
	}

	return false
}