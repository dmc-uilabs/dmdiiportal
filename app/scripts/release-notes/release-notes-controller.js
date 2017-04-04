'use strict';

angular.module('dmc.release-notes')
    .controller('release-notes-controller', ['$stateParams', '$state', "$scope", "ajax", function ($stateParams, $state, $scope, ajax) {
      $scope.notes = [
      {
            content: "Display-name Drop-down Menu",
            notes:
            [
                  {
                        content: "My Account",
                        notes:
                        [
                              {
                                    content: "Account Basics"
                              },
                              {
                                    content: "Privacy"
                              },
                              {
                                    content: "Notifications"
                              }
                        ]
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
            content: "Top Menu",
            notes:
            [
                  {
                        content: "Invitations"
                  },
                  {
                        content: "Notifications"
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
                                    content: "Individuals",
                                    notes:
                                    [
                                          {
                                                content: "User Profile page"
                                          }
                                    ]
                              },
                              {
                                    content: "Organization",
                                    notes:
                                    [
                                          {
                                                content: "Organization Profile page"
                                          }
                                    ]
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
                                    content: "Member Directory",
                                    notes:
                                    [
                                          {
                                                content: "Member Organization Profile page"
                                          }
                                    ]
                              },
                              {
                                    content: "Projects Directory",
                                    notes:
                                    [
                                          {
                                                content: "DMDII Project Profile page"
                                          }
                                    ]
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
