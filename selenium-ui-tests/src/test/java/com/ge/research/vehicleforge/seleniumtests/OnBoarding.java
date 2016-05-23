package com.ge.research.vehicleforge.seleniumtests;

import org.junit.Test;

public class OnBoarding extends BaseTest {
	
	@Test
	public void onBoarding() throws Exception{
		testDMCLogin();	
		TestOnBoarding();
	}

}
