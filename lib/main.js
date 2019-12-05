"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function getNext(members, last) {
    const lastIndex = members.findIndex(member => member == last);
    if (lastIndex == -1 || lastIndex + 1 >= members.length) {
        return members[0];
    }
    else {
        return members[lastIndex + 1];
    }
}
exports.getNext = getNext;
function getTeamMembers(token, teamName) {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = new github.GitHub(token);
        const { data: teamData } = yield octokit.teams.getByName(splitTeamName(teamName));
        const { data: data } = yield octokit.teams.listMembers({ team_id: teamData.id });
        return data.map(member => member.login);
    });
}
function splitMembersList(list) {
    return list.split(/\s+/).map(member => (member[0] == '@' ? member.substring(1) : member));
}
exports.splitMembersList = splitMembersList;
function splitTeamName(teamName) {
    const matches = teamName.match(/@?([^/]+)\/(.+)/);
    return { org: matches[1], team_slug: matches[2] };
}
exports.splitTeamName = splitTeamName;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const exclude = core.getInput('exclude') || [];
            const include = core.getInput('include') || [];
            const last = core.getInput('last');
            const teamName = core.getInput('teamName');
            const token = core.getInput('token');
            let members = [];
            if (teamName) {
                if (!token) {
                    throw new Error('`token` is required when `teamName` is supplied');
                }
                members = members.concat(yield getTeamMembers(token, teamName));
            }
            members = members
                .concat(splitMembersList(include))
                .filter(member => member in splitMembersList(exclude))
                .sort();
            core.setOutput('next', getNext(members, last));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
