import * as agentSchema from "./agent";
import * as mapSchema from "./map";
import * as matchSchema from "./match";
import * as playerSchema from "./player";
import * as playerMatchSchema from "./playerMatch";
import * as teamSchema from "./team";

const index = {
    ...agentSchema,
    ...mapSchema,
    ...matchSchema,
    ...playerSchema,
    ...playerMatchSchema,
    ...teamSchema,
};

export default index;
