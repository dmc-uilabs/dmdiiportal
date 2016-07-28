package com.ge.research.vehicleforge.seleniumtests;

import org.junit.Ignore;
import org.junit.Test;

public class DiscussionsAndTasksFunctionalityRunnerTest extends BaseTest{
	@Ignore
	@Test
	public void testFunctionality() throws Exception {
		AddProjectFunctionalityTest apt = new AddProjectFunctionalityTest();
		String projectUrl = apt.addProjectFunctionalityTest();
		DiscussionFunctionalityTest discussion = new DiscussionFunctionalityTest();
		discussion.verifyDiscussionFunctionality(projectUrl);
	}
	

}
