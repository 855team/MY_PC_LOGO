go test tests/* -coverprofile=coverage.out -coverpkg=./...
go tool cover -func=coverage.out
sleep 2
go tool cover -html=coverage.out