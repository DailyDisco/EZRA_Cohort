module scripts

go 1.24

replace github.com/careecodes/RentDaddy => ../

require (
	github.com/careecodes/RentDaddy v0.0.0-00010101000000-000000000000
	github.com/clerk/clerk-sdk-go/v2 v2.2.0
	github.com/go-faker/faker/v4 v4.6.0
	github.com/jackc/pgx/v5 v5.7.3
)

require (
	github.com/go-jose/go-jose/v3 v3.0.3 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	golang.org/x/crypto v0.36.0 // indirect
	golang.org/x/sync v0.12.0 // indirect
	golang.org/x/text v0.23.0 // indirect
)
