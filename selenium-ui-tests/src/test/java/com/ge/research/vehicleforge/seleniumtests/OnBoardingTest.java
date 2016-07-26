package com.ge.research.vehicleforge.seleniumtests;

import org.junit.Test;
import org.junit.Ignore;

public class OnBoardingTest extends BaseTest {
	
	@Ignore
	@Test
	public void onBoarding() throws Exception{
		testDMCLogin();	
		TestOnBoarding();
	}

}
