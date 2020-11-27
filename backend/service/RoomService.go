package service

import (
	"backend/dao"
	"backend/utils"
)

func GetRooms() (success bool, msg int, data []utils.GetRoomsResponse) {
	for rid, entry := range RoomSSE.Rooms {
		data = append(data, utils.GetRoomsResponse{
			Rid: rid,
			Name: entry.Name,
			Uid1: entry.Owner,
			Uid2: entry.Partner,
			Username1: dao.GetUserByUid(entry.Owner).Username,
			Username2: dao.GetUserByUid(entry.Partner).Username,
		})
	}
	success, msg = true, utils.RoomsGetSuccess
	return
}

func NewCommand(params utils.NewCommandParams) (success bool, msg int) {
	uid := CheckToken(params.Token)
	if uid != 0 {
		entry := RoomSSE.GetRoomEntry(params.Rid)
		if entry == nil {
			success, msg = false, utils.RoomDoNotExist
		} else {
			commandEntry := utils.CommandEntry{
				Uid: uid,
				Command: params.Content,
			}
			if !entry.HasOwner || !entry.HasPartner {
				success, msg = false, utils.RoomUserNotEnough
			} else if entry.Owner != uid && entry.Partner != uid {
				success, msg = false, utils.RoomNoPermission
			} else {
				entry.Lock.Lock()
				entry.File = append(entry.File, commandEntry)
				entry.OwnerStream <- entry.File
				entry.PartnerStream <- entry.File
				entry.Lock.Unlock()
				success, msg = true, utils.RoomNewCommandSuccess
			}
		}
	} else {
		success, msg = false, utils.InvalidToken
	}

	return
}