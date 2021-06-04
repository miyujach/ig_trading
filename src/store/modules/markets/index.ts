import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default {
	state: (): any => state,
	actions,
	getters,
	mutations
};
