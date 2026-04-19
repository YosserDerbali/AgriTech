"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("diagnoses");

    if (!table.ai_model_version) {
      await queryInterface.addColumn("diagnoses", "ai_model_version", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!table.validated) {
      await queryInterface.addColumn("diagnoses", "validated", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    if (!table.validated_by) {
      await queryInterface.addColumn("diagnoses", "validated_by", {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      });
    }

    // Backfill diagnosis metadata from latest prediction per image before removing old links.
    await queryInterface.sequelize.query(`
      UPDATE diagnoses AS d
      SET
        ai_model_version = COALESCE(d.ai_model_version, p.ai_model_version),
        validated = COALESCE(p.validated, d.validated, FALSE),
        validated_by = COALESCE(p.validated_by, d.validated_by)
      FROM (
        SELECT DISTINCT ON (image_id)
          image_id,
          ai_model_version,
          validated,
          validated_by,
          created_at
        FROM predictions
        ORDER BY image_id, created_at DESC
      ) AS p
      WHERE d.image_id IS NOT NULL AND d.image_id = p.image_id;
    `).catch(() => null);

    const refreshed = await queryInterface.describeTable("diagnoses");

    if (refreshed.disease_id) {
      await queryInterface.removeColumn("diagnoses", "disease_id");
    }

    if (refreshed.plant_id) {
      await queryInterface.removeColumn("diagnoses", "plant_id");
    }

    if (refreshed.image_id) {
      await queryInterface.removeColumn("diagnoses", "image_id");
    }

    await queryInterface.dropTable("predictions").catch(() => null);
    await queryInterface.dropTable("diseases").catch(() => null);
    await queryInterface.dropTable("images").catch(() => null);
    await queryInterface.dropTable("plants").catch(() => null);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.createTable("plants", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    }).catch(() => null);

    await queryInterface.createTable("images", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      plant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "plants",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      uploaded_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    }).catch(() => null);

    await queryInterface.createTable("diseases", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      plant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "plants",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      symptoms: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      treatment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    }).catch(() => null);

    await queryInterface.createTable("predictions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      image_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "images",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      disease_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "diseases",
          key: "id",
        },
      },
      confidence: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      ai_model_version: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      validated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      validated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
        defaultValue: "PENDING",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    }).catch(() => null);

    const table = await queryInterface.describeTable("diagnoses");

    if (!table.image_id) {
      await queryInterface.addColumn("diagnoses", "image_id", {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "images",
          key: "id",
        },
        onDelete: "SET NULL",
      });
    }

    if (!table.plant_id) {
      await queryInterface.addColumn("diagnoses", "plant_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "plants",
          key: "id",
        },
        onDelete: "SET NULL",
      });
    }

    if (!table.disease_id) {
      await queryInterface.addColumn("diagnoses", "disease_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "diseases",
          key: "id",
        },
        onDelete: "SET NULL",
      });
    }

    if (table.validated_by) {
      await queryInterface.removeColumn("diagnoses", "validated_by");
    }

    if (table.validated) {
      await queryInterface.removeColumn("diagnoses", "validated");
    }

    if (table.ai_model_version) {
      await queryInterface.removeColumn("diagnoses", "ai_model_version");
    }
  },
};
