package com.ge.research.vehicleforge.seleniumtests;

import org.junit.Ignore;
import org.junit.Test;

public class DiscussionsAndTasksFunctionalityRunnerTest extends BaseTest{
	@Ignore
	@Test
	public void testFunctionality() throws Exception {
		AddProjectTest apt = new AddProjectTest();
		String projectUrl = apt.testAddProject();
		DiscussionFunctionalityTest discussion = new DiscussionFunctionalityTest();
		discussion.verifyDiscussionFunctionality(projectUrl);
	}
	

}
