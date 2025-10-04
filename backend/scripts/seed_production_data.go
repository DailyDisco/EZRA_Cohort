package main

import (
	"context"
	"log"
	"os"

	db "github.com/careecodes/RentDaddy/internal/db/generated"
	"github.com/careecodes/RentDaddy/internal/utils"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	log.Println("[PRODUCTION_SEEDER] Starting production data seeding...")

	// Get database connection string from environment
	pgURL := os.Getenv("PG_URL")
	if pgURL == "" {
		log.Fatal("[PRODUCTION_SEEDER] PG_URL environment variable is required")
	}

	// Initialize database connection pool
	ctx := context.Background()
	pool, err := pgxpool.New(ctx, pgURL)
	if err != nil {
		log.Fatalf("[PRODUCTION_SEEDER] Error initializing pg pool: %v", err)
	}
	defer pool.Close()

	// Initialize queries
	queries := db.New(pool)

	// Run the seeder (adminID parameter is not used in the current implementation)
	err = utils.SeedDB(queries, pool, 0)
	if err != nil {
		log.Fatalf("[PRODUCTION_SEEDER] Error seeding production data: %v", err)
	}

	log.Println("[PRODUCTION_SEEDER] Production data seeding completed successfully!")
}
