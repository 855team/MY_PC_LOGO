docker run -p 30087:3306 --name=logo_test -e MYSQL_DATABASE=test -e MYSQL_USER=test -e MYSQL_PASSWORD=test -e MYSQL_RANDOM_ROOT_PASSWORD=1 -e MYSQL_DATABASE=test -d mysql:5.7

go run main.go