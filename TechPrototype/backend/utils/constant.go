package utils

const IsTest = true

const (
	InvalidFormat			=	0
	InvalidToken			= 	1
	LoginNoSuchUser			=	2
	LoginWrongPassword		=	3
	LoginSuccess			=	4
	RegisterSuccess			=	5
	RegisterUserExists		=	6
	ModifyUserSuccess		=	7
	ModifyUserAuthSuccess	=	8
	ModifyDupUsername		=	9
	GetUserSuccess			=	10
	ProjectNewSuccess		=	11
	ProjectNoPermission		=	12
	ProjectModifySuccess	=	13
	ProjectDeleteSuccess	=	14
	ProjectGetSuccess		=	15
	FileNewSuccess			=	16
	FileNoPermission		=	17
	FileModifySuccess		=	18
	FileDeleteSuccess		=	19
)

const TokenTerm = 30 * 60 // 30min

/* Structure of Response */
type ResponseBean struct {
	Success		bool			`json:"success"`
	Msg			int 			`json:"msg"`
	Data		interface{} 	`json:"data"`
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