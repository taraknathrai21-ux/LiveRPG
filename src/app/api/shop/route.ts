import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { INITIAL_SHOP_ITEMS, INITIAL_ACHIEVEMENTS, INITIAL_TEMPLATES } from "@/server/game/seed-data";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !user.character) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Not authenticated." } },
      { status: 401 }
    );
  }

  let dbItems = await prisma.shopItem.findMany({
    where: { active: true },
    orderBy: [{ levelRequirement: "asc" }, { price: "asc" }],
  });

  // Auto-seed or synchronize database if missing items
  if (dbItems.length < INITIAL_SHOP_ITEMS.length) {
    for (const item of INITIAL_SHOP_ITEMS) {
      await prisma.shopItem.upsert({
        where: { slug: item.slug },
        update: item,
        create: item,
      });
    }

    for (const achievement of INITIAL_ACHIEVEMENTS) {
      await prisma.achievement.upsert({
        where: { slug: achievement.slug },
        update: achievement,
        create: achievement,
      });
    }

    for (const template of INITIAL_TEMPLATES) {
      await prisma.questTemplate.upsert({
        where: { slug: template.slug },
        update: template,
        create: template,
      });
    }

    dbItems = await prisma.shopItem.findMany({
      where: { active: true },
      orderBy: [{ levelRequirement: "asc" }, { price: "asc" }],
    });
  }

  const userInventory = await prisma.inventoryItem.findMany({
    where: { userId: user.id },
  });
  const ownedItemIds = new Set(userInventory.map((i) => i.itemId));

  const character = user.character;
  const equippedThemes = new Set([character.equippedTheme]);
  const equippedAvatars = new Set([character.equippedAvatar]);
  const equippedTitles = new Set([character.equippedTitle]);
  const equippedFrames = new Set([character.equippedFrame]);

  const decorated = dbItems.map((item) => {
    const isOwned = ownedItemIds.has(item.id);
    let isEquipped = false;

    if (item.category === "THEME") isEquipped = equippedThemes.has(item.effectKey);
    else if (item.category === "AVATAR") isEquipped = equippedAvatars.has(item.effectKey);
    else if (item.category === "TITLE") isEquipped = equippedTitles.has(item.name);
    else if (item.category === "FRAME") isEquipped = equippedFrames.has(item.effectKey);

    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      levelRequirement: item.levelRequirement,
      effectKey: item.effectKey,
      isOwned,
      isEquipped,
      canAfford: character.gold >= item.price,
    };
  });

  return NextResponse.json({
    ok: true,
    data: decorated,
  });
}
