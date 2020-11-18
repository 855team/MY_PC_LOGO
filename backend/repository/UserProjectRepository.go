package repository

func PairUidAndPid(uid uint, pid uint) {
	db.Table("users_projects").Create(&map[string]interface{}{
		"user_uid": uid,
		"project_pid": pid,
	})
	return
}

func GetPidsByUid(uid uint) (ret []uint) {
	type queryType struct {
		user_uid uint
		project_pid uint
	}

	rows, _ := db.Table("users_projects").Select("user_uid", "project_pid").Where("user_uid = ?", uid).Rows()

	for rows.Next() {
		query := queryType{}
		_ = rows.Scan(&query.user_uid, &query.project_pid)
		ret = append(ret, query.project_pid)
	}
	return
}