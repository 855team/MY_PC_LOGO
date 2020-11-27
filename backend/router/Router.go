package router

import (
	"backend/controller"
	"backend/middleware"
	"github.com/kataras/iris/v12"
)

func SetRouter(app *iris.Application) {
	root := app.Party("/", middleware.CrsAuth()).AllowMethods(iris.MethodOptions)

	root.Handle("GET", "/getrooms", controller.GetRooms)

	root.Handle("POST", "/login", controller.Login)
	root.Handle("POST", "/register", controller.Register)
	root.Handle("POST", "/getuser", controller.GetUser)
	root.Handle("POST", "/modifyuser", controller.ModifyUser)
	root.Handle("POST", "/modifyuserauth", controller.ModifyUserAuth)
	root.Handle("POST", "/newproject", controller.NewProject)
	root.Handle("POST", "/modifyproject", controller.ModifyProject)
	root.Handle("POST", "/getproject", controller.GetProject)
	root.Handle("POST", "/deleteproject", controller.DeleteProject)
	root.Handle("POST", "/modifyfile", controller.ModifyFile)
	root.Handle("POST", "/newfile", controller.NewFile)
	root.Handle("POST", "/deletefile", controller.DeleteFile)
	root.Handle("POST", "/newcommand", controller.NewCommand)

	root.Handle("GET", "/rooms", controller.HandleRoom)
	return
}