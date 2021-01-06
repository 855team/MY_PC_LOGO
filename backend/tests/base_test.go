package tests

import (
	"backend/server"
	"github.com/iris-contrib/httpexpect/v2"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/httptest"
	"os"
	"testing"
)

var (
	app			*iris.Application
	testToken1	string
	testToken2	string
)

func TestMain(m *testing.M) {
	app = server.NewApp()
	testToken1 = "0000000000000000000000000000000000000000000000000000000000000000"
	testToken2 = "1111111111111111111111111111111111111111111111111111111111111111"
	exitCode := m.Run()
	os.Exit(exitCode)
}

func post(t *testing.T, path string, Object interface{}, StatusCode int, success bool, Msg int, data interface{}) *httpexpect.Object {
	e := getHttpExpect(t)
	var testMap map[string]interface{}

	if data != nil {
		testMap = map[string]interface{} {
			"success": success,
			"msg": Msg,
			"data": data,
		}
	} else {
		testMap = map[string]interface{} {
			"success": success,
			"msg": Msg,
		}
	}

	return e.POST(path).WithJSON(Object).
		Expect().Status(StatusCode).
		JSON().Object().ContainsMap(testMap)
}


func getHttpExpect(t *testing.T) *httpexpect.Expect {
	return httptest.New(t, app, httptest.Configuration{Debug: true, URL: "http://localhost:8080"})
}


