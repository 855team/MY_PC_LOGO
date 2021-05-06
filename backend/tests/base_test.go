package tests

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/context"
	"github.com/kataras/iris/v12/core/router"
	"github.com/kataras/iris/v12/i18n"
	"os"
	"testing"
)

var (
	testToken1	string
	testToken2	string
	testToken3	string
)

func TestMain(m *testing.M) {
	testToken1 = "0000000000000000000000000000000000000000000000000000000000000000"
	testToken2 = "1111111111111111111111111111111111111111111111111111111111111111"
	testToken3 = "2222222222222222222222222222222222222222222222222222222222222222"
	exitCode := m.Run()
	os.Exit(exitCode)
}

func GetContextPool(app *iris.Application, irisConfigurators ...iris.Configurator) *context.Pool {
	app.I18n = i18n.New()
	app.Configure(iris.WithConfiguration(iris.DefaultConfiguration()), iris.WithLogLevel("disable"))
	app.Configure(irisConfigurators...)

	app.HTTPErrorHandler = router.NewDefaultHandler(app.ConfigurationReadOnly(), app.Logger())
	app.ContextPool = context.New(func() interface{} {
		return context.NewContext(app)
	})

	return app.ContextPool
}
