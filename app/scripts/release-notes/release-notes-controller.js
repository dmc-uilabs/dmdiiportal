'use strict';

angular.module('dmc.release-notes')
    .controller('release-notes-controller', ['$stateParams', '$state', "$scope", "ajax", function ($stateParams, $state, $scope, ajax) {
      $scope.notes = [
      {
            content: "Display-name Drop-down Menu",
            notes:
            [
                  {
                        content: "My Account"
                  },
                  {
                        content: "My Profile"
                  },
                  {
                        content: "My Workspaces Directory",
                        notes:
                        [
                              {
                                    content: "Home"
                              },
                              {
                                    content: "Discussions"
                              },
                              {
                                    content: "Team"
                              },
                              {
                                    content: "Documents"
                              },
                              {
                                    content: "Tasks"
                              },
                              {
                                    content: "Services"
                              }
                        ]
                  },
                  {
                        content: "Create DMDII Content"
                  },
                  {
                        content: "Create DMDII Member"
                  },
                  {
                        content: "Create DMDII Project"
                  }
            ]
      },
      {
            content:"Header",
            notes:
            [
                  {
                        content: "Explore",
                        notes:
                        [
                              {
                                    content: "Individuals"
                              },
                              {
                                    content: "Organization"
                              },
                              {
                                    content: "Activities"
                              },
                              {
                                    content: "All Workspaces Directory",
                                    notes:
                                    [
                                          {
                                                content: "Home"
                                          },
                                          {
                                                content: "Discussions"
                                          },
                                          {
                                                content: "Team"
                                          },
                                          {
                                                content: "Documents"
                                          },
                                          {
                                                content: "Tasks"
                                          },
                                          {
                                                content: "Services"
                                          }
                                    ]
                              }
                        ]
                  },
                  {
                        content: "Learn",
                        notes:
                        [
                              {
                                    content: "About the DMC"
                              },
                              {
                                    content: "Application Creation"
                              },
                              {
                                    content: "Workforce Development"
                              },
                              {
                                    content: "Security"
                              },
                              {
                                    content: "Release Notes"
                              }
                        ]
                  },
                  {
                        content:"My Organization"
                  },
                  {
                        content: "Marketplace",
                        notes:
                        [
                              {
                                    content: "Application Profile page"
                              }
                        ]
                  },
                  {
                        content: "DMDII Portal",
                        notes:
                        [
                              {
                                    content: "About Portal"
                              },
                              {
                                    content: "Member Directory"
                              },
                              {
                                    content: "Projects Directory"
                              }
                        ]
                  }
            ]
      },
      {
            content: "Footer",
            notes:
            [
                  {
                        content: "FAQs"
                  },
                  {
                        content: "Terms of Service",
                        notes:
                        [
                              {
                                    content: "General Terms of Service"
                              },
                              {
                                    content: "Member Terms of Service"
                              },
                              {
                                    content: "Privacy Policy"
                              }
                        ]
                  },
                  {
                        content: "Contact Us"
                  }
            ]
      }


      ]
    }]
);
