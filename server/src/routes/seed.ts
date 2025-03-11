import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { companiesTable } from "../db/schema/companies";
import { HonoEnv } from "../types";
import { modelsTable } from "../db/schema/models";
import { tradeOffersTable } from "../db/schema/tradeOffers";
import { eq } from "drizzle-orm";
import { modelTradeConditionOptionsTable } from "../db/schema/modelTradeConditionOptions";
import { modelTradeConditionQuestionsTable } from "../db/schema/modelTradeConditionsQuestions";
import { translationsTable } from "../db/schema/translations";
import { usersTable } from "../db/schema/users";

const app = new Hono<HonoEnv>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  try {
    await db.delete(tradeOffersTable).execute();
    await db.delete(modelTradeConditionOptionsTable).execute();
    await db.delete(modelTradeConditionQuestionsTable).execute();
    await db.delete(modelsTable).execute();
    await db.delete(companiesTable).execute();
    await db.delete(translationsTable).execute();
    await db.delete(usersTable).execute();

    await db.insert(usersTable).values({
      id: "al1yuq732pdolaf",
      email: "demo@furkanleba.com",
      firstName: "Demo",
      lastName: "Hesap",
      hashedPassword:
        "7a95e789250224eb9759b9a27d264c78:522e353cb63d26c338e8ebdd4a7fb11e0110d54eadbed4b492e3decccf04ca39d33e85e5c2906dbdd29eb468b05da159a2200418b1617c49c5586aade1f82755",
    });

    const companies = [
      { name: "Apple" },
      { name: "Samsung" },
      { name: "Lg" },
      { name: "Xiaomi" },
      { name: "Huawei" },
      { name: "Sony" },
    ];
    await db.insert(companiesTable).values(companies);

    const companyModels: Record<
      string,
      { name: string; maxTradeValue: number }[]
    > = {
      Apple: [
        { name: "iPhone 16E", maxTradeValue: 28000 },
        { name: "iPhone 15", maxTradeValue: 32000 },
        { name: "iPhone 15 Plus", maxTradeValue: 36000 },
        { name: "iPhone 15 Pro", maxTradeValue: 42000 },
        { name: "iPhone 15 Pro Max", maxTradeValue: 45000 },
        { name: "iPhone SE", maxTradeValue: 18000 },
      ],
      Samsung: [
        { name: "Galaxy S24", maxTradeValue: 23000 },
        { name: "Galaxy S24+", maxTradeValue: 24000 },
        { name: "Galaxy S24 Ultra", maxTradeValue: 36000 },
        { name: "Galaxy A54", maxTradeValue: 10000 },
        { name: "Galaxy Z Flip 6", maxTradeValue: 27000 },
      ],
      Lg: [
        { name: "LG Velvet", maxTradeValue: 6000 },
        { name: "LG Wing", maxTradeValue: 6500 },
        { name: "LG Q70", maxTradeValue: 5000 },
        { name: "LG K92", maxTradeValue: 5500 },
        { name: "LG G8X", maxTradeValue: 7000 },
      ],
      Xiaomi: [
        { name: "Redmi Note 12", maxTradeValue: 10000 },
        { name: "Mi 12", maxTradeValue: 15000 },
        { name: "Xiaomi 13", maxTradeValue: 4800 },
        { name: "Redmi K60", maxTradeValue: 5000 },
        { name: "Poco X5", maxTradeValue: 3500 },
      ],
      Huawei: [
        { name: "P40 Pro", maxTradeValue: 9000 },
        { name: "Mate 50", maxTradeValue: 9500 },
        { name: "Nova 10", maxTradeValue: 7000 },
        { name: "P50 Pro", maxTradeValue: 10000 },
        { name: "Mate Xs", maxTradeValue: 11000 },
      ],
      Sony: [
        { name: "Xperia 1 V", maxTradeValue: 10000 },
        { name: "Xperia 5 IV", maxTradeValue: 9000 },
        { name: "Xperia 10 IV", maxTradeValue: 6000 },
        { name: "Xperia Pro", maxTradeValue: 10500 },
        { name: "Xperia L4", maxTradeValue: 5500 },
      ],
    };

    for (const companyName in companyModels) {
      const company = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.name, companyName))
        .then((rows) => rows[0]);

      if (!company) continue;

      for (const modelData of companyModels[companyName]) {
        const insertedModel = await db
          .insert(modelsTable)
          .values({
            name: modelData.name,
            companyId: company.id,
            maxTradeValue: modelData.maxTradeValue,
          })
          .returning({
            id: modelsTable.id,
            maxTradeValue: modelsTable.maxTradeValue,
          });
        const model = insertedModel[0];

        const [question1] = await db
          .insert(modelTradeConditionQuestionsTable)
          .values({
            modelId: model.id,
            questionKey: "device_on_question",
          })
          .returning({ id: modelTradeConditionQuestionsTable.id });
        await db.insert(modelTradeConditionOptionsTable).values([
          {
            questionId: question1.id,
            labelKey: "device_on_yes",
            descriptionKey: "device_on_yes_desc",
            deduction: 0,
          },
          {
            questionId: question1.id,
            labelKey: "device_on_no",
            descriptionKey: "device_on_no_desc",
            deduction: Math.floor(model.maxTradeValue * 0.4),
          },
        ]);

        const [question2] = await db
          .insert(modelTradeConditionQuestionsTable)
          .values({
            modelId: model.id,
            questionKey: "dummy_question_2",
          })
          .returning({ id: modelTradeConditionQuestionsTable.id });
        await db.insert(modelTradeConditionOptionsTable).values([
          {
            questionId: question2.id,
            labelKey: "dummy_q2_option_yes",
            descriptionKey: "dummy_q2_option_yes_desc",
            deduction: Math.floor(model.maxTradeValue * 0.25),
          },
          {
            questionId: question2.id,
            labelKey: "dummy_q2_option_no",
            descriptionKey: "dummy_q2_option_no_desc",
            deduction: 0,
          },
        ]);

        const [question3] = await db
          .insert(modelTradeConditionQuestionsTable)
          .values({
            modelId: model.id,
            questionKey: "dummy_question_3",
          })
          .returning({ id: modelTradeConditionQuestionsTable.id });
        await db.insert(modelTradeConditionOptionsTable).values([
          {
            questionId: question3.id,
            labelKey: "dummy_q3_option_yes",
            descriptionKey: "dummy_q3_option_yes_desc",
            deduction: 0,
          },
          {
            questionId: question3.id,
            labelKey: "dummy_q3_option_no",
            descriptionKey: "dummy_q3_option_no_desc",
            deduction: Math.floor(model.maxTradeValue * 0.1),
          },
        ]);
      }
    }

    await db.insert(translationsTable).values([
      // Question 1 için
      {
        locale: "tr-TR",
        key: "device_on_question",
        text: "Cihaz açılıyor mu?",
      },
      {
        locale: "en-US",
        key: "device_on_question",
        text: "Does the device turn on?",
      },
      { locale: "tr-TR", key: "device_on_yes", text: "Evet" },
      { locale: "en-US", key: "device_on_yes", text: "Yes" },
      {
        locale: "tr-TR",
        key: "device_on_yes_desc",
        text: "Cihaz açılıyor.",
      },
      {
        locale: "en-US",
        key: "device_on_yes_desc",
        text: "Device turns on.",
      },
      { locale: "tr-TR", key: "device_on_no", text: "Hayır" },
      { locale: "en-US", key: "device_on_no", text: "No" },
      {
        locale: "tr-TR",
        key: "device_on_no_desc",
        text: "Cihaz açılmıyor.",
      },
      {
        locale: "en-US",
        key: "device_on_no_desc",
        text: "Device doesn't turn on.",
      },
      //Question 2
      {
        locale: "tr-TR",
        key: "dummy_question_2",
        text: "Ekran hasarı var mı?",
      },
      {
        locale: "en-US",
        key: "dummy_question_2",
        text: "Does the screen have damage?",
      },
      { locale: "tr-TR", key: "dummy_q2_option_yes", text: "Evet" },
      { locale: "en-US", key: "dummy_q2_option_yes", text: "Yes" },
      {
        locale: "tr-TR",
        key: "dummy_q2_option_yes_desc",
        text: "Ekranda hasar var.",
      },
      {
        locale: "en-US",
        key: "dummy_q2_option_yes_desc",
        text: "Screen is damaged.",
      },
      { locale: "tr-TR", key: "dummy_q2_option_no", text: "Hayır" },
      { locale: "en-US", key: "dummy_q2_option_no", text: "No" },
      {
        locale: "tr-TR",
        key: "dummy_q2_option_no_desc",
        text: "Ekranda hasar yok.",
      },
      {
        locale: "en-US",
        key: "dummy_q2_option_no_desc",
        text: "No screen damage.",
      },

      // Question  3
      {
        locale: "tr-TR",
        key: "dummy_question_3",
        text: "Batarya durumu iyi mi?",
      },
      {
        locale: "en-US",
        key: "dummy_question_3",
        text: "Is the battery in good condition?",
      },
      { locale: "tr-TR", key: "dummy_q3_option_yes", text: "Evet" },
      { locale: "en-US", key: "dummy_q3_option_yes", text: "Yes" },
      {
        locale: "tr-TR",
        key: "dummy_q3_option_yes_desc",
        text: "Batarya iyi durumda.",
      },
      {
        locale: "en-US",
        key: "dummy_q3_option_yes_desc",
        text: "Battery health is good.",
      },
      { locale: "tr-TR", key: "dummy_q3_option_no", text: "Hayır" },
      { locale: "en-US", key: "dummy_q3_option_no", text: "No" },
      {
        locale: "tr-TR",
        key: "dummy_q3_option_no_desc",
        text: "Batarya kötü durumda.",
      },
      {
        locale: "en-US",
        key: "dummy_q3_option_no_desc",
        text: "Battery is in poor condition.",
      },
    ]);

    c.json({ success: true, message: "Seed success..." });
  } catch (error) {
    console.error("Seed failed ", error);
    c.json({ success: false, error });
  }
});

export default app;
