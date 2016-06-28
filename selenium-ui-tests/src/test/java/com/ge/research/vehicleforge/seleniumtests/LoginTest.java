package com.ge.research.vehicleforge.seleniumtests;

import org.junit.Test;


/**
 * @author Amine Chigani
 *
 * Unit tests for navigating through the Home page of the site
 * clicking each link and checking whether the correct page is loaded.
 */

public class LoginTest extends BaseTest {

	
	@Test
	public void testLogin() throws Exception{
		testDMCLogin();	
	}


}
