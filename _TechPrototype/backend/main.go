package main

import (
	"backend/repository"
	"backend/router"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/middleware/logger"
	"github.com/kataras/iris/v12/middleware/recover"
)

func main() {
	app := NewApp()

	if err := app.Run(iris.Addr("0.0.0.0:8080"), iris.WithoutServerError(iris.ErrServerClosed)); err != nil {
		panic("Failed to Start Server!")
	}
}

func NewApp() *iris.Application {
	app := iris.New()
	app.Logger().SetLevel("debug")

	app.Use(recover.New())
	app.Use(logger.New())

	router.SetRouter(app)
	repository.InitDBConn()

	return app
}