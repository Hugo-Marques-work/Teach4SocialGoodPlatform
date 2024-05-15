import TrainingPack from "../TrainingPack/TrainingPack";
import SimplePackStepDto from "./SimplePackStepDto";

export default class PackStepDto extends SimplePackStepDto{
  pack: TrainingPack = new TrainingPack();

  constructor(pack: TrainingPack, sessionIndex: number, stepIndex: number) {
    super(pack.name, sessionIndex, stepIndex);
    this.pack = pack;
  }
}