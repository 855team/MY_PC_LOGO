go test tests/* -v -coverprofile=coverage.out -coverpkg=./...
go tool cover -func=coverage.out
sleep 2
go tool cover -html=coverage.out