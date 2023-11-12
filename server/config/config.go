package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	Environment string
	Port        string
	Host        string
	DBHost      string
	DBPort      string
	DBUser      string
	DBPassword  string
	DBName      string
	DBSSLMode   string
}

func Load(configType, configName, configPath string) (*Config, error) {
	var config *Config

	viper.AddConfigPath(configPath)
	viper.SetConfigName(configName)
	viper.SetConfigType(configType)

	err := viper.ReadInConfig()
	if err != nil {
		return nil, fmt.Errorf("ошибка чтения конфигурации: %w", err)
	}

	err = viper.Unmarshal(&config)
	if err != nil {
		return nil, fmt.Errorf("ошибка разбора конфигурации: %w", err)
	}

	return config, nil
}
