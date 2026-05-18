import { threatRepository } from "@/lib/db/repositories/threatRepository";
import { MonstersList } from "@/features/monsters/components/monsters-list";

export default async function MonstersPage() {
    const monsters = await threatRepository.getAll();

    return (
        <div className="h-full flex flex-col">
            <MonstersList initialMonsters={monsters} />
        </div>
    );
}
