package main

import (
	"log"
	"log/slog"
	"os"

	"github.com/TemaStatham/Little-Messenger/config"
	"github.com/TemaStatham/Little-Messenger/internal/handler"
	"github.com/TemaStatham/Little-Messenger/internal/repository"
	"github.com/TemaStatham/Little-Messenger/internal/services"
)

const (
	configPath = "D:/study/Little-Messenger/Little-Messenger/server/config"
	configName = "config"
	configType = "yaml"

	envLocal = "local"
	envDev   = "dev"
	envProd  = "prod"
)

func setupLogger(env string) *slog.Logger {
	var log *slog.Logger

	switch env {
	case envLocal:
		log = slog.New(
			slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}),
		)
	case envDev:
		log = slog.New(
			slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}),
		)
	case envProd:
		log = slog.New(
			slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}),
		)
	default:
		log = slog.New(
			slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}),
		)
	}

	return log
}

func main() {
	config, err := config.Load(configType, configName, configPath)
	if err != nil {
		log.Fatalf("could not load configuration file: %v", err)
	}

	logger := setupLogger(config.Environment)

	db, err := repository.NewPostgresDB(repository.Config{
		Host:     config.DBHost,
		Port:     config.DBPort,
		Username: config.DBUser,
		Password: config.DBPassword,
		DBName:   config.DBName,
		SSLMode:  config.DBSSLMode,
	})
	if err != nil {
		logger.Error(err.Error())
	}

	repos := repository.NewRepository(db)
	serv := services.NewService(repos)
	handlers := handler.NewHandler(serv)

	router := handlers.InitRoutes()
	router.Run()
	// srv := new(server.Server)
	// if err := srv.Run(config.Port, handlers.InitRoutes()); err != nil {
	// 	logger.Error("error occured while running http server: %s", err)
	// }

	// signalChan := make(chan os.Signal, 1)
	// signal.Notify(signalChan, os.Interrupt)
	// <-signalChan
	// if err := srv.Shutdown(context.Background()); err != nil {
	// 	panic(err)
	// }
}
