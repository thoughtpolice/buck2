// @generated
// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: install.proto

// Protobuf Java Version: 3.25.6
package com.facebook.buck.install.model;

@javax.annotation.Generated(value="protoc", comments="annotations:InstallerProto.java.pb.meta")
public final class InstallerProto {
  private InstallerProto() {}
  public static void registerAllExtensions(
      com.google.protobuf.ExtensionRegistryLite registry) {
  }

  public static void registerAllExtensions(
      com.google.protobuf.ExtensionRegistry registry) {
    registerAllExtensions(
        (com.google.protobuf.ExtensionRegistryLite) registry);
  }
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_InstallInfoRequest_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_InstallInfoRequest_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_InstallInfoRequest_FilesEntry_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_InstallInfoRequest_FilesEntry_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_InstallResponse_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_InstallResponse_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_FileReadyRequest_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_FileReadyRequest_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_FileResponse_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_FileResponse_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_DeviceMetadata_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_DeviceMetadata_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_DeviceMetadata_Entry_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_DeviceMetadata_Entry_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_ErrorDetail_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_ErrorDetail_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_ShutdownRequest_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_ShutdownRequest_fieldAccessorTable;
  static final com.google.protobuf.Descriptors.Descriptor
    internal_static_install_ShutdownResponse_descriptor;
  static final 
    com.google.protobuf.GeneratedMessageV3.FieldAccessorTable
      internal_static_install_ShutdownResponse_fieldAccessorTable;

  public static com.google.protobuf.Descriptors.FileDescriptor
      getDescriptor() {
    return descriptor;
  }
  private static  com.google.protobuf.Descriptors.FileDescriptor
      descriptor;
  static {
    java.lang.String[] descriptorData = {
      "\n\rinstall.proto\022\007install\"\215\001\n\022InstallInfo" +
      "Request\022\022\n\ninstall_id\030\001 \001(\t\0225\n\005files\030\002 \003" +
      "(\0132&.install.InstallInfoRequest.FilesEnt" +
      "ry\032,\n\nFilesEntry\022\013\n\003key\030\001 \001(\t\022\r\n\005value\030\002" +
      " \001(\t:\0028\001\"%\n\017InstallResponse\022\022\n\ninstall_i" +
      "d\030\001 \001(\t\"P\n\020FileReadyRequest\022\022\n\ninstall_i" +
      "d\030\001 \001(\t\022\014\n\004name\030\002 \001(\t\022\014\n\004sha1\030\003 \001(\t\022\014\n\004p" +
      "ath\030\004 \001(\t\"\234\001\n\014FileResponse\022\022\n\ninstall_id" +
      "\030\001 \001(\t\022\014\n\004name\030\002 \001(\t\022\014\n\004path\030\003 \001(\t\022*\n\014er" +
      "ror_detail\030\004 \001(\0132\024.install.ErrorDetail\0220" +
      "\n\017device_metadata\030\005 \003(\0132\027.install.Device" +
      "Metadata\"c\n\016DeviceMetadata\022,\n\005entry\030\001 \003(" +
      "\0132\035.install.DeviceMetadata.Entry\032#\n\005Entr" +
      "y\022\013\n\003key\030\001 \001(\t\022\r\n\005value\030\002 \001(\t\"V\n\013ErrorDe" +
      "tail\022\017\n\007message\030\001 \001(\t\022(\n\010category\030\002 \001(\0162" +
      "\026.install.ErrorCategory\022\014\n\004tags\030\003 \003(\t\"\027\n" +
      "\017ShutdownRequestJ\004\010\001\020\002\"\030\n\020ShutdownRespon" +
      "seJ\004\010\001\020\002*W\n\rErrorCategory\022\036\n\032ERROR_CATEG" +
      "ORY_UNSPECIFIED\020\000\022\n\n\006TIER_0\020\001\022\t\n\005INPUT\020\002" +
      "\022\017\n\013ENVIRONMENT\020\0032\331\001\n\tInstaller\022B\n\007Insta" +
      "ll\022\033.install.InstallInfoRequest\032\030.instal" +
      "l.InstallResponse\"\000\022?\n\tFileReady\022\031.insta" +
      "ll.FileReadyRequest\032\025.install.FileRespon" +
      "se\"\000\022G\n\016ShutdownServer\022\030.install.Shutdow" +
      "nRequest\032\031.install.ShutdownResponse\"\000B3\n" +
      "\037com.facebook.buck.install.modelB\016Instal" +
      "lerProtoP\001b\006proto3"
    };
    descriptor = com.google.protobuf.Descriptors.FileDescriptor
      .internalBuildGeneratedFileFrom(descriptorData,
        new com.google.protobuf.Descriptors.FileDescriptor[] {
        });
    internal_static_install_InstallInfoRequest_descriptor =
      getDescriptor().getMessageTypes().get(0);
    internal_static_install_InstallInfoRequest_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_InstallInfoRequest_descriptor,
        new java.lang.String[] { "InstallId", "Files", });
    internal_static_install_InstallInfoRequest_FilesEntry_descriptor =
      internal_static_install_InstallInfoRequest_descriptor.getNestedTypes().get(0);
    internal_static_install_InstallInfoRequest_FilesEntry_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_InstallInfoRequest_FilesEntry_descriptor,
        new java.lang.String[] { "Key", "Value", });
    internal_static_install_InstallResponse_descriptor =
      getDescriptor().getMessageTypes().get(1);
    internal_static_install_InstallResponse_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_InstallResponse_descriptor,
        new java.lang.String[] { "InstallId", });
    internal_static_install_FileReadyRequest_descriptor =
      getDescriptor().getMessageTypes().get(2);
    internal_static_install_FileReadyRequest_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_FileReadyRequest_descriptor,
        new java.lang.String[] { "InstallId", "Name", "Sha1", "Path", });
    internal_static_install_FileResponse_descriptor =
      getDescriptor().getMessageTypes().get(3);
    internal_static_install_FileResponse_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_FileResponse_descriptor,
        new java.lang.String[] { "InstallId", "Name", "Path", "ErrorDetail", "DeviceMetadata", });
    internal_static_install_DeviceMetadata_descriptor =
      getDescriptor().getMessageTypes().get(4);
    internal_static_install_DeviceMetadata_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_DeviceMetadata_descriptor,
        new java.lang.String[] { "Entry", });
    internal_static_install_DeviceMetadata_Entry_descriptor =
      internal_static_install_DeviceMetadata_descriptor.getNestedTypes().get(0);
    internal_static_install_DeviceMetadata_Entry_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_DeviceMetadata_Entry_descriptor,
        new java.lang.String[] { "Key", "Value", });
    internal_static_install_ErrorDetail_descriptor =
      getDescriptor().getMessageTypes().get(5);
    internal_static_install_ErrorDetail_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_ErrorDetail_descriptor,
        new java.lang.String[] { "Message", "Category", "Tags", });
    internal_static_install_ShutdownRequest_descriptor =
      getDescriptor().getMessageTypes().get(6);
    internal_static_install_ShutdownRequest_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_ShutdownRequest_descriptor,
        new java.lang.String[] { });
    internal_static_install_ShutdownResponse_descriptor =
      getDescriptor().getMessageTypes().get(7);
    internal_static_install_ShutdownResponse_fieldAccessorTable = new
      com.google.protobuf.GeneratedMessageV3.FieldAccessorTable(
        internal_static_install_ShutdownResponse_descriptor,
        new java.lang.String[] { });
  }

  // @@protoc_insertion_point(outer_class_scope)
}
