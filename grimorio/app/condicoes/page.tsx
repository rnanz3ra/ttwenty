import { conditionRepository } from "@/lib/db/repositories/conditionRepository";
import { ConditionsList } from "@/features/conditions/components/conditions-list";

export default async function ConditionsPage() {
    const conditions = await conditionRepository.getAll();

    return (
        <div className="h-full flex flex-col">
            <ConditionsList initialConditions={conditions} />
        </div>
    );
}
