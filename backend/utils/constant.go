package utils

import (
	"backend/model"
	"sync"
)

const IsTest = true

const (
	InvalidFormat			=	0
	InvalidToken			=	1
	LoginNoSuchUser			=	2
	LoginWrongPassword		=	3
	LoginSuccess			=	4
	RegisterSuccess			=	5
	RegisterUserExists		=	6
	UserModifySuccess		=	7
	UserAuthModifySuccess	=	8
	ModifyDupUsername		=	9
	UserGetSuccess			=	10
	ProjectNewSuccess		=	11
	ProjectNoPermission		=	12
	ProjectModifySuccess	=	13
	ProjectDeleteSuccess	=	14
	ProjectGetSuccess		=	15
	FileNewSuccess			=	16
	FileNoPermission		=	17
	FileModifySuccess		=	18
	FileDeleteSuccess		=	19
	RoomEnterSuccess		=	20
	RoomCommandStream		=	21
	RoomDoNotExist			=	22
	RoomNoPermission		=	23
	RoomUserAlreadyInRoom	=	24
	RoomSSENotSupported		=	25
	RoomNewCommandSuccess	=	26
	RoomUserNotEnough		=	27
	RoomsGetSuccess			=	28
)

const TokenTerm = 30 * 60 // 30min

/* Structure of Response */
type ResponseBean struct {
	Success		bool			`json:"success"`
	Msg			int 			`json:"msg"`
	Data		interface{} 	`json:"data"`
}

type GetProjectResponse struct {
	Pid			uint			`json:"pid"`
	Name		string			`json:"name"`
	Files		[]model.File	`json:"files"`
}

type GetRoomsResponse struct {
	Rid			uint			`json:"rid"`
	Name		string			`json:"name"`
	Uid1		uint			`json:"uid1"`
	Uid2		uint			`json:"uid2"`
	Username1	string			`json:"username1"`
	Username2	string			`json:"username2"`
}

/* Structure of Request Parameters */
type LoginParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterParams struct {
	Username	string		`json:"username"`
	Password	string		`json:"password"`
	Email		string		`json:"email"`
}

type ModifyUserParams struct {
	Token		string		`json:"token"`
	Username	string		`json:"username"`
	Email		string		`json:"email"`
	Turtle		uint		`json:"turtle"`
	Task		uint		`json:"task"`
}

type ModifyUserAuthParams struct {
	Token		string		`json:"token"`
	Password	string		`json:"password"`
}

type GetUserParams struct {
	Token		string		`json:"token"`
}

type DeleteUserParams struct {
	Token		string		`json:"token"`
}

type NewProjectParams struct {
	Token		string		`json:"token"`
	Name		string		`json:"name"`
}

type ModifyProjectParams struct {
	Token		string		`json:"token"`
	Pid			uint		`json:"pid"`
	Name		string		`json:"name"`
}

type DeleteProjectParams struct {
	Token		string		`json:"token"`
	Pid			uint		`json:"pid"`
}

type GetProjectParams struct {
	Token		string		`json:"token"`
	Pid			uint		`json:"pid"`
}

type NewFileParams struct {
	Token		string		`json:"token"`
	Pid			uint		`json:"pid"`
	Name		string		`json:"name"`
	Content		string		`json:"content"`
}

type ModifyFileParams struct {
	Token		string		`json:"token"`
	Fid			uint		`json:"fid"`
	Name		string		`json:"name"`
	Content		string		`json:"content"`
}

type DeleteFileParams struct {
	Token		string		`json:"token"`
	Fid			uint		`json:"fid"`
}

type NewCommandParams struct {
	Token		string		`json:"token"`
	Rid			uint		`json:"rid"`
	Content		string		`json:"content"`
}

/* Others */
type CommandEntry struct {
	Uid			uint	`json:"uid"`
	Command		string	`json:"command"`
}

type RoomEntry struct {
	Name			string
	Owner			uint
	Partner			uint
	HasOwner		bool
	HasPartner		bool
	OwnerStream		chan []CommandEntry
	PartnerStream	chan []CommandEntry
	File			[]CommandEntry
	Lock			*sync.Mutex
}