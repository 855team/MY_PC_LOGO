package utils

import (
	"encoding/json"
	"github.com/kataras/iris/v12"
	"net/http"
)

var GetContextParams = func(ctx iris.Context, params interface{}) bool {
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

var SendResponse = func(ctx iris.Context, success bool, msg int, data interface{}) {
	ctx.StatusCode(iris.StatusOK)
	_, _ = ctx.JSON(ResponseBean{
		Success: success,
		Msg: msg,
		Data: data,
	})
}

var SendStreamResponse = func(ctx iris.Context, flusher http.Flusher, success bool, msg int, data interface{}) {
	str, _ := json.Marshal(ResponseBean{
		Success: success,
		Msg: msg,
		Data: data,
	})

	_, _ = ctx.Writef("data: %s\n\n", string(str))
	flusher.Flush()
}

var UintListContains = func(list []uint, element uint) bool {
	for _, elem := range list {
		if elem == element {
			return true
		}
	}

	return false
}
