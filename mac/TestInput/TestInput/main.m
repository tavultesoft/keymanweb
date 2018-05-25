/*
 
 File:main.m
 
 Abstract: main entry for number input input method.
 
 Version: 1.0
 
 Disclaimer: IMPORTANT:  This Apple software is supplied to you by
 Apple Inc. ("Apple") in consideration of your agreement to the
 following terms, and your use, installation, modification or
 redistribution of this Apple software constitutes acceptance of these
 terms.  If you do not agree with these terms, please do not use,
 install, modify or redistribute this Apple software.
 
 In consideration of your agreement to abide by the following terms, and
 subject to these terms, Apple grants you a personal, non-exclusive
 license, under Apple's copyrights in this original Apple software (the
 "Apple Software"), to use, reproduce, modify and redistribute the Apple
 Software, with or without modifications, in source and/or binary forms;
 provided that if you redistribute the Apple Software in its entirety and
 without modifications, you must retain this notice and the following
 text and disclaimers in all such redistributions of the Apple Software.
 Neither the name, trademarks, service marks or logos of Apple Inc.
 may be used to endorse or promote products derived from the Apple
 Software without specific prior written permission from Apple.  Except
 as expressly stated in this notice, no other rights or licenses, express
 or implied, are granted by Apple herein, including but not limited to
 any patent rights that may be infringed by your derivative works or by
 other works in which the Apple Software may be incorporated.
 
 The Apple Software is provided by Apple on an "AS IS" basis.  APPLE
 MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
 THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS
 FOR A PARTICULAR PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND
 OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS.
 
 IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL
 OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION,
 MODIFICATION AND/OR DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED
 AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE),
 STRICT LIABILITY OR OTHERWISE, EVEN IF APPLE HAS BEEN ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 
 Copyright (C) 2007 Apple Inc. All Rights Reserved.
 
 */
#import <Cocoa/Cocoa.h>
#import <InputMethodKit/InputMethodKit.h>

//Each input method needs a unique connection name.
//Note that periods and spaces are not allowed in the connection name.
const NSString* kConnectionName = @"TestInput_2_Connection";

//let this be a global so our application controller delegate can access it easily
IMKServer*       server;

int main(int argc, const char * argv[]) {
    NSString *identifier;
    @autoreleasepool {
        identifier = [[NSBundle mainBundle] bundleIdentifier];
        server = [[IMKServer alloc] initWithName:(NSString *)kConnectionName bundleIdentifier:identifier];
        [NSBundle loadNibNamed:@"MainMenu" owner:[NSApplication sharedApplication]];
        [[NSApplication sharedApplication] run];
    }
    return 0;
}

//int main(int argc, char *argv[])
//{
//    NSString* identifier;
//
//    //find the bundle identifier and then initialize the input method server
//    identifier = [[NSBundle mainBundle] bundleIdentifier];
//    server = [[IMKServer alloc] initWithName:(NSString*)kConnectionName bundleIdentifier:[[NSBundle mainBundle] bundleIdentifier]];
//    NSLog(@"About to load MainMenu...");
//    @try {
//        [NSBundle loadNibNamed:@"MainMenu" owner:[NSApplication sharedApplication]];
//        if ([[NSApplication sharedApplication] mainMenu])
//            NSLog(@"Finished loading MainMenu!");
//        else
//            NSLog(@"MainMenu not set!!!");
//    }
//    @catch (NSException *e) {
//        NSLog(@"Error loading MainMenu: %@", e.description);
//    }
//
//    //finally run everything
//    [[NSApplication sharedApplication] run];
//
//    return 0;
//}
