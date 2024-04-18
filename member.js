function skillsMembers() {
    return {
        restrict: 'E',
        templateUrl: 'app/components/skills/members.html',
        controller: 'SkillsMembersController',
        controllerAs: 'vm',
        bindToController: true,
        scope: {
            members: '='
        }
    };
}