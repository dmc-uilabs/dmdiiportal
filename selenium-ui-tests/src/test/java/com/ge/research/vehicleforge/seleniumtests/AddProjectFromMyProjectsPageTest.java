package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class AddProjectFromMyProjectsPageTest extends BaseTest {

	@Ignore
	@Test
	public void addProjectFromMyProjectsPageTest() throws Exception {
		// Test Projects -> My Projects
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-menu-item[1]/a/span"))).click();
		assertEquals("My Projects", driver.getTitle());

		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();

		AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
		addProject.addProjectFunctionalityTest();

	}
}
