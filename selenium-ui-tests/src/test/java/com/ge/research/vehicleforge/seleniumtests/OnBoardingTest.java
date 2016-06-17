package com.ge.research.vehicleforge.seleniumtests;

import org.junit.Test;

public class OnBoardingTest extends BaseTest {
	
	@Test
	public void onBoarding() throws Exception{
		testDMCLogin();	
		TestOnBoarding();
	}

}
