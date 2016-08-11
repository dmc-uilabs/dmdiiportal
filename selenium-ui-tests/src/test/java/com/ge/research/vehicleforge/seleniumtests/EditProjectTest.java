package com.ge.research.vehicleforge.seleniumtests;

import static org.junit.Assert.assertEquals;
import java.util.logging.Level;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class EditProjectTest extends BaseTest {

	@Ignore
	@Test
	public void testEditProject() throws Exception {
		Thread.sleep(TestUtils.sleep3Second);
		driver.findElement(By.xpath("//div[2]/div/div/div/div/md-menu[2]/button")).click();
		wait.until(ExpectedConditions.elementToBeClickable(By.linkText("My Projects"))).click();
		assertEquals("My Projects", driver.getTitle());

		driver.findElement(By.xpath("//md-toolbar/div/a/span")).click();
		AddProjectFunctionalityTest addProject = new AddProjectFunctionalityTest();
		addProject.addProjectFunctionalityTest();

		Thread.sleep(TestUtils.sleep5Second);

		driver.findElement(By.xpath("html/body/div[2]/ui-view/div[1]/md-toolbar/div/a[1]")).click();

		// edit private type
		driver.findElement(By.xpath("//md-input-container[2]/md-select")).click();
		driver.findElement(By.xpath("//md-option[2]/div")).click();

		// edit overview
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(TestUtils.overviewEdit);

		// edit tag
		driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input")).clear();
		driver.findElement(By.xpath("//md-content[2]/div/form/md-input-container/input"))
				.sendKeys(TestUtils.ProjectTagEdit);
		Thread.sleep(TestUtils.sleep3Second);
		wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//md-content[2]/div/form/button")))
				.sendKeys(Keys.ENTER);

		// next to add member
		WebElement next = driver.findElement(By.xpath("//button[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", next);
		if (next.isEnabled()) {
			next.sendKeys(Keys.ENTER);
		} else {
			log.info("The button NEXT is not clickable!");
		}

		Thread.sleep(TestUtils.sleep3Second);

		// submit to update the new project
		WebElement submit = driver.findElement(By.xpath("//ap-tab-two/div/div[2]/button[2]"));
		jse.executeScript("arguments[0].scrollIntoView(true);", submit);
		if (submit.isEnabled()) {
			submit.sendKeys(Keys.ENTER);
		} else {
			log.log(Level.INFO, "The button submit is not clickable!");
		}
	}

}
