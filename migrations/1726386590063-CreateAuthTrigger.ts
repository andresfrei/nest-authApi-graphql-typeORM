import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTrigger1726386590063 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION create_user_from_auth()
            RETURNS TRIGGER AS $$
            BEGIN
                IF NEW.isEmailConfirmed THEN
                    INSERT INTO "user" (id)
                    VALUES (NEW.id);
                END IF;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;

            CREATE TRIGGER trigger_create_user_after_auth_confirm
            AFTER UPDATE OF "isEmailConfirmed" ON authentication
            FOR EACH ROW
            WHEN (NEW."isEmailConfirmed" IS TRUE AND OLD."isEmailConfirmed" IS DISTINCT FROM TRUE)
            EXECUTE FUNCTION create_user_from_auth();

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TRIGGER IF EXISTS trigger_create_user_after_auth_confirm ON auth;
            DROP FUNCTION IF EXISTS create_user_from_auth;
        `);
  }
}
