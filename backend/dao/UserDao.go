package dao

import (
	"backend/model"
	"backend/repository"
)

var GetUserAuthByUsername = func(username string) model.UserAuth {
	return repository.GetUserAuthByUsername(username)
}

var GetUserAuthByUid = func(uid uint) model.UserAuth {
	return repository.GetUserAuthByUid(uid)
}

var CreateUserAuth = func(userauth model.UserAuth) uint {
	return repository.CreateUserAuth(userauth)
}

var SetUserAuth = func(userauth model.UserAuth) {
	repository.SaveUserAuth(userauth)
	return
}

var GetUserByUsername = func(username string) model.User {
	return repository.GetUserByUsername(username)
}

var GetUserByUid = func(uid uint) model.User {
	if uid == 0 {
		return model.User{}
	} else {
		return repository.GetUserByUid(uid)
	}
}

var CreateUser = func(user model.User) uint {
	return repository.CreateUser(user)
}

var SetUser = func(user model.User) {
	repository.SaveUser(user)
	return
}

var RemoveUser = func(uid uint) {
	repository.RemoveUser(uid)
}

var RemoveUserAuth = func(uid uint) {
	repository.RemoveUserAuth(uid)
}