package utils

import (
	"context"
	_ "database/sql"
	"errors"
	"fmt"
	"log"
	"math/rand"

	db "github.com/careecodes/RentDaddy/internal/db/generated"
	"github.com/go-faker/faker/v4"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

func RandomWorkCategory() db.WorkCategory {
	categories := []db.WorkCategory{
		db.WorkCategoryPlumbing,
		db.WorkCategoryElectric,
		db.WorkCategoryCarpentry,
		db.WorkCategoryHvac,
		db.WorkCategoryOther,
	}

	return categories[rand.Intn(len(categories))]
}

func RandomComplaintCategory() db.ComplaintCategory {
	categories := []db.ComplaintCategory{
		db.ComplaintCategoryNoise,
		db.ComplaintCategoryMaintenance,
		db.ComplaintCategoryOther,
	}

	return categories[rand.Intn(len(categories))]
}

func RandomStatus() db.Status {
	statuses := []db.Status{
		db.StatusClosed,
		db.StatusInProgress,
		db.StatusOpen,
		db.StatusResolved,
	}

	return statuses[rand.Intn(len(statuses))]
}

func createWorkOrders(queries *db.Queries, user db.User, ctx context.Context) error {
	for i := 0; i < 10; i++ {
		_, err := queries.CreateWorkOrder(context.Background(), db.CreateWorkOrderParams{
			CreatedBy:   user.ID,
			Category:    RandomWorkCategory(),
			Title:       faker.Sentence(),
			Description: faker.Paragraph(),
			UnitNumber:  int64(rand.Intn(100) + 1), // Random unit number
		})
		if err != nil {
			return errors.New(fmt.Sprintf("[SEEDER] error creating work order: %v", err.Error()))
		}
	}

	log.Println("[SEEDER] work orders seeded successfully")

	return nil
}

func createComplaints(queries *db.Queries, user db.User, ctx context.Context) error {
	for i := 0; i < 10; i++ {
		_, err := queries.CreateComplaint(ctx, db.CreateComplaintParams{
			CreatedBy:   user.ID,
			Category:    RandomComplaintCategory(),
			Title:       faker.Sentence(),
			Description: faker.Paragraph(),
			UnitNumber:  pgtype.Int8{Int64: int64(rand.Intn(100) + 1), Valid: true},
		})
		if err != nil {
			return errors.New(fmt.Sprintf("[SEEDER] error creating complaint: %v", err.Error()))
		}
	}

	log.Println("[SEEDER] complaints seeded successfully")
	return nil
}

func assignApartment(pool *pgxpool.Pool, queries *db.Queries, user db.User, ctx context.Context) error {
	randomApartment, err := pool.Query(ctx, "SELECT id, unit_number, price, size, management_id, lease_id FROM apartments WHERE availability = true ORDER BY RANDOM() LIMIT 1")
	if err != nil {
		return errors.New("[SEEDER] error getting random apartment: " + err.Error())
	}

	var apartment db.Apartment
	for randomApartment.Next() {
		if err := randomApartment.Scan(
			&apartment.ID,
			&apartment.UnitNumber,
			&apartment.Price,
			&apartment.Size,
			&apartment.ManagementID,
		); err != nil {
			return errors.New("[SEEDER] error scanning apartment: " + err.Error())
		}

		err := queries.UpdateApartment(ctx, db.UpdateApartmentParams{
			ID:           apartment.ID,
			Price:        apartment.Price,
			ManagementID: apartment.ManagementID,
			Availability: false,
		})
		if err != nil {
			return errors.New("[SEEDER] error updating apartment availability: " + err.Error())
		}
	}

	return nil
}

func SeedDB(queries *db.Queries, pool *pgxpool.Pool, adminID int32) error {
	ctx := context.Background()

	log.Println("[SEEDER] Starting production user data seeding...")

	// Define the specific Clerk user IDs for production seeding
	adminClerkID := "user_33bWcFij7GfSChr9WtEFrffNRtq"
	clientClerkID := "user_33bWeJ1zCXC0iliXr5TgRZVYX1R"

	// Fetch admin user by Clerk ID
	adminUserRow, err := queries.GetUserByClerkId(ctx, adminClerkID)
	if err != nil {
		return errors.New("[SEEDER] error getting admin user: " + err.Error())
	}

	// Fetch client user by Clerk ID
	clientUserRow, err := queries.GetUserByClerkId(ctx, clientClerkID)
	if err != nil {
		return errors.New("[SEEDER] error getting client user: " + err.Error())
	}

	// Convert rows to User structs
	adminUser := db.User{
		ID:        adminUserRow.ID,
		ClerkID:   adminUserRow.ClerkID,
		FirstName: adminUserRow.FirstName,
		LastName:  adminUserRow.LastName,
		Email:     adminUserRow.Email,
		Phone:     adminUserRow.Phone,
		Role:      adminUserRow.Role,
		Status:    adminUserRow.Status,
		CreatedAt: adminUserRow.CreatedAt,
		UpdatedAt: adminUserRow.CreatedAt, // Using CreatedAt as UpdatedAt since it's not provided
	}

	clientUser := db.User{
		ID:        clientUserRow.ID,
		ClerkID:   clientUserRow.ClerkID,
		FirstName: clientUserRow.FirstName,
		LastName:  clientUserRow.LastName,
		Email:     clientUserRow.Email,
		Phone:     clientUserRow.Phone,
		Role:      clientUserRow.Role,
		Status:    clientUserRow.Status,
		CreatedAt: clientUserRow.CreatedAt,
		UpdatedAt: clientUserRow.CreatedAt, // Using CreatedAt as UpdatedAt since it's not provided
	}

	users := []db.User{adminUser, clientUser}

	log.Printf("[SEEDER] Found %d production users to seed data for", len(users))

	for _, u := range users {
		log.Printf("[SEEDER] Seeding data for user: %s %s (%s)", u.FirstName, u.LastName, u.Email)

		// Seed work orders for this user
		wOCount, err := queries.ListWorkOrdersByUser(ctx, u.ID)
		if err != nil {
			log.Printf("[SEEDER] error counting work orders for user %s: %v", u.Email, err)
		} else if len(wOCount) < 10 {
			log.Printf("[SEEDER] Creating work orders for user %s (current: %d)", u.Email, len(wOCount))
			err := createWorkOrders(queries, u, ctx)
			if err != nil {
				log.Printf("[SEEDER] error creating work orders for user %s: %v", u.Email, err)
				// Continue with other users instead of failing completely
			}
		} else {
			log.Printf("[SEEDER] User %s already has %d work orders, skipping", u.Email, len(wOCount))
		}

		// Seed complaints for this user (only for tenant role)
		if u.Role == db.RoleTenant {
			cCount, err := queries.ListTenantComplaints(ctx, u.ID)
			if err != nil {
				log.Printf("[SEEDER] error counting complaints for user %s: %v", u.Email, err)
			} else if len(cCount) < 10 {
				log.Printf("[SEEDER] Creating complaints for user %s (current: %d)", u.Email, len(cCount))
				err = createComplaints(queries, u, ctx)
				if err != nil {
					log.Printf("[SEEDER] error creating complaints for user %s: %v", u.Email, err)
					// Continue with other users instead of failing completely
				}
			} else {
				log.Printf("[SEEDER] User %s already has %d complaints, skipping", u.Email, len(cCount))
			}
		} else {
			log.Printf("[SEEDER] User %s is not a tenant, skipping complaints seeding", u.Email)
		}
	}

	log.Println("[SEEDER] Production user data seeding completed!")
	return nil
}
