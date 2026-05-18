import { spellRepository } from "@/lib/db/repositories/spellRepository";
import { SpellsList } from "@/features/spells/components/spells-list";

export default async function SpellsPage() {
    const spells = await spellRepository.getAll();

    return (
        <div className="h-full flex flex-col">
            <SpellsList initialSpells={spells} />
        </div>
    );
}
