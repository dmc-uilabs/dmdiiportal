package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;

import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;

public class DeleteProjectTest extends BaseTest {

	@Ignore
	@Test
	public void deleteProjectTest() throws Exception {
		Thread.sleep(TestUtils.sleep3Second);
		driver.get(baseUrl + "/my-projects.php#/");
		Thread.sleep(TestUtils.sleep5Second);
		assertEquals("My Projects", driver.getTitle());
		
		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
		addProject.addProjectFunctionalityTest();

		Thread.sleep(TestUtils.sleep5Second);
		// click "edit" button
		driver.findElement(By.xpath("html/body/div[2]/ui-view/div[1]/md-toolbar/div/a[1]")).click();
		// click "Delete Project"
		driver.findElement(By.xpath("html/body/div[2]/ui-view/div/div/div/div[1]/md-toolbar/div/button")).click();
		// choose No
		driver.findElement(By.xpath("html/body/div[6]/md-dialog/div/button[1]")).click();
		Thread.sleep(TestUtils.sleep3Second);
		// click "Delete Project"
		driver.findElement(By.xpath("html/body/div[2]/ui-view/div/div/div/div[1]/md-toolbar/div/button")).click();
		// choose Yes
		driver.findElement(By.xpath("html/body/div[6]/md-dialog/div/button[2]")).click();

	}

}
