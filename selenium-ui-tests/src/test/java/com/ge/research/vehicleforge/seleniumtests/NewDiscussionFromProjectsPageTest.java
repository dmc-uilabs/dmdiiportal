package com.ge.research.vehicleforge.seleniumtests;

import java.util.concurrent.TimeUnit;
import org.junit.*;
import static org.junit.Assert.*;
import org.openqa.selenium.*;


public class NewDiscussionFromProjectsPageTest extends BaseTest{



	@Test
	public void testNewDiscussionFromProjectsPage() throws Exception {
		String header = TestUtils.getHeader();

		String projectsPage = baseUrl + "/project.php#/3/home";
		driver.manage().timeouts().pageLoadTimeout(15, TimeUnit.SECONDS);
		driver.get(projectsPage);

		String discussionName = header + "testing for selenium";
		String discussionMessage = header + "new discussion from projects page";
		String discussionTag = header + "test tags";
		String discussionReply = header + "test a reply";
		String discussionFlag = header + "test a flag";
		String discussionComment = header + "test a comment";

		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div/md-input-container/input")).clear();
		driver.findElement(By.xpath("//div/md-input-container/input")).sendKeys(discussionName);
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(discussionMessage);
		driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).clear();
		driver.findElement(By.xpath("//div[2]/div/form/md-input-container/input")).sendKeys(discussionTag);
		driver.findElement(By.xpath("//div[2]/div/form/button")).click();
		driver.findElement(By.xpath("//button[2]")).click();

		driver.findElement(By.xpath("//div[3]/div/div/a")).click();
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(discussionReply);
		driver.findElement(By.xpath("//form/div/div/button[2]")).click();
		driver.findElement(By.xpath("//div[3]/div/div/a[2]")).click();
		driver.findElement(By.xpath("//md-select")).click();
		driver.findElement(By.xpath("//md-option")).click();
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(discussionFlag);
		driver.findElement(By.xpath("//form/div/div/button[2]")).click();
		driver.findElement(By.xpath("//textarea")).clear();
		driver.findElement(By.xpath("//textarea")).sendKeys(discussionComment);
		driver.findElement(By.xpath("//form/div/button")).click();
		driver.findElement(By.xpath("//div[2]/button")).click();
		driver.findElement(By.xpath("//div[3]/button[2]")).click();
		driver.findElement(By.xpath("//div/button")).click();
		driver.findElement(By.xpath("//div/button")).click();

		assertTrue(driver.getPageSource().contains(discussionReply));

		assertTrue(driver.getPageSource().contains(discussionComment));

		driver.get(projectsPage);
		
		String table = driver.findElement(By.xpath("/html/body/div[2]/ui-view/div[2]/div/div[1]/div[2]/div[2]/md-content")).getText();

		assertTrue(table.contains(discussionName));




	}
}
