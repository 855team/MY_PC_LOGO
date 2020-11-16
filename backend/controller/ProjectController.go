package controller

import (
	"backend/service"
	"backend/utils"
	"github.com/kataras/iris/v12"
)

func NewProject(ctx iris.Context) {
	var params utils.NewProjectParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg, data := service.NewProject(params)

	utils.SendResponse(ctx, success, msg, data)
}

func ModifyProject(ctx iris.Context) {
	var params utils.ModifyProjectParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg:= service.ModifyProject(params)

	utils.SendResponse(ctx, success, msg, nil)
}

func GetProject(ctx iris.Context) {
	var params utils.GetProjectParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg, data := service.GetProject(params)
	if success {
		utils.SendResponse(ctx, success, msg, data)
	} else {
		utils.SendResponse(ctx, success, msg, nil)
	}
}

func DeleteProject(ctx iris.Context) {
	var params utils.DeleteProjectParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg := service.DeleteProject(params)

	utils.SendResponse(ctx, success, msg, nil)
}

func NewFile(ctx iris.Context) {
	var params utils.NewFileParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg, data := service.NewFile(params)

	utils.SendResponse(ctx, success, msg, data)
}

func ModifyFile(ctx iris.Context) {
	var params utils.ModifyFileParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg := service.ModifyFile(params)

	utils.SendResponse(ctx, success, msg, nil)
}

func DeleteFile(ctx iris.Context) {
	var params utils.DeleteFileParams
	if !utils.GetContextParams(ctx, &params) {
		return
	}

	success, msg := service.DeleteFile(params)

	utils.SendResponse(ctx, success, msg, nil)
}