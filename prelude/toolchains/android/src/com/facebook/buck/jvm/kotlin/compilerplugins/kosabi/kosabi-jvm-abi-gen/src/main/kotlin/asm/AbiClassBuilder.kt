/*
 * Portions Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under both the MIT license found in the
 * LICENSE-MIT file in the root directory of this source tree and the Apache
 * License, Version 2.0 found in the LICENSE-APACHE file in the root directory
 * of this source tree.
 */

/*
 * Copyright 2010-2018 JetBrains s.r.o. and Kotlin Programming Language contributors.
 * Use of this source code is governed by the Apache 2.0 license that can be found in the license/LICENSE.txt file.
 */

package com.facebook.asm

import org.jetbrains.kotlin.codegen.AbstractClassBuilder
import org.jetbrains.kotlin.com.intellij.psi.PsiElement
import org.jetbrains.kotlin.descriptors.DescriptorVisibilities
import org.jetbrains.kotlin.descriptors.MemberDescriptor
import org.jetbrains.kotlin.resolve.inline.InlineUtil.isInlineOrContainingInline
import org.jetbrains.kotlin.resolve.jvm.diagnostics.JvmDeclarationOrigin
import org.jetbrains.org.objectweb.asm.ClassVisitor
import org.jetbrains.org.objectweb.asm.FieldVisitor
import org.jetbrains.org.objectweb.asm.MethodVisitor
import org.jetbrains.org.objectweb.asm.Opcodes

@SuppressWarnings("PackageLocationMismatch")
internal class AbiClassBuilder(private val cv: ClassVisitor) : AbstractClassBuilder() {
  override fun getVisitor(): ClassVisitor = cv

  override fun newMethod(
      origin: JvmDeclarationOrigin,
      access: Int,
      name: String,
      desc: String,
      signature: String?,
      exceptions: Array<out String>?
  ): MethodVisitor {
    // if both descriptor's and access's visibilities are private, we can generate an empty method
    // 1. we need to check a descriptor, because inline reified functions
    //    might have a non-private visibility in ABI, but they are private in bytecode
    // 2. we need to check an access, because synthetic methods
    //    for default parameters have private visibility, but public in bytecode
    val descriptor = origin.descriptor as? MemberDescriptor
    if (isPrivate(access) && descriptor != null && isPrivate(descriptor) || isClinit(name, access))
        return EMPTY_METHOD_VISITOR

    val mv = super.newMethod(origin, access, name, desc, signature, exceptions)
    // inline function bodies are part of ABI,
    // but non-inline functions can be thrown out
    if (isInlineOrContainingInline(descriptor)) return mv

    return ReplaceWithEmptyMethodVisitor(
        delegate = mv,
        access = access,
        name = name,
        desc = desc,
        signature = signature,
        exceptions = exceptions)
  }

  override fun newField(
      origin: JvmDeclarationOrigin,
      access: Int,
      name: String,
      desc: String,
      signature: String?,
      value: Any?
  ): FieldVisitor {
    if (isPrivate(access) && !isInlineOrContainingInline(origin.descriptor))
        return EMPTY_FIELD_VISITOR

    return super.newField(origin, access, name, desc, signature, value)
  }

  override fun defineClass(
      origin: PsiElement?,
      version: Int,
      access: Int,
      name: String,
      signature: String?,
      superName: String,
      interfaces: Array<out String>
  ) {
    if (isPrivate(access)) return

    super.defineClass(origin, version, access, name, signature, superName, interfaces)
  }

  private fun isPrivate(descriptor: MemberDescriptor): Boolean =
      descriptor.visibility == DescriptorVisibilities.PRIVATE

  private fun isPrivate(access: Int): Boolean =
      (access and Opcodes.ACC_PRIVATE) == Opcodes.ACC_PRIVATE

  private fun isClinit(name: String, access: Int): Boolean =
      name == "<clinit>" && (access and Opcodes.ACC_STATIC) == Opcodes.ACC_STATIC
}
